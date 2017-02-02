module.exports =
{
	"name": "Grapht",
	"slug": "grapht",
	"languages": ["Scala", "SQL"],
	"img": "/img/screenshots/grapht.png",
	"desc": "Hybrid graph / relational database offering faster performance than either alternative can offer alone",
	"description": `
<p>
	For my master's dissertation from Cambridge, I looked into the possibility of hybridising Graph and Relational databases. Relational databases are very
	efficient for any operations which need repeating across the rows in a table, where graph databases are much more efficient when traversing relationships
	between items. This is because travevrsing relationships in a relational database requires self-joins, which create exponentially-sized data structures, whereas
	graph databases can exploit graph locality to ignore large swathes of the graph.
</p>
<p>
	My approach involved using a relational datbase as an underlying data store, along with a partial graph representing the same data stored in memory. Queries were
	then analysed and dispatched to either the original database or resolved through the in-memory store. By taking this approach, Grapht was able to avoid the degenerate
	worst-case performance of both relational and graph databases. This is particularly beneficial for complex queries which involve both row-centric and graph-centric
	components. The chart to the right shows this performance increase for Grapht compared to both PostgreSQL and Neo4J for one such query. The percentages indicate
	the proportion of time spent executing the row-centric (Lenvenshtein) and graph-centric (A*) components of the query.
</p>
<p>
	I was awarded a top Distinction for this dissertation, and for my Master's degree overall.
</p>
	`,
	"codeDescription": "Grapht was my first Scala project. The code below shows one of the prefetchers tested - likely not the most idiomatic Scala, but included here for completeness!",
	"codeLanguage": "scala",
	"code": `
package uk.littlehq.cjol.grapht

import anorm.SQL
import scala.collection.mutable.{ListBuffer, Set}

/**
	* Created by cjol on 28/04/16.
	*/


class LookaheadMultiPrefetcher(hops: Int)
	(implicit connection:java.sql.Connection) extends Prefetcher {

	override def innerGet(k: Long): (GraphNode, List[GraphNode]) = {
		var edgeMap = Map[Long, (ListBuffer[Edge], Map[String, Any])]()

		val idsWeWant = Set[Long](k)
		val idsWeHave = Set[Long]()

		for (i <- 0 to hops) {
			val sql = SQL(
				"""SELECT points.id AS id, points.lat AS lat, points.lng AS lng,
				|	edges.id1 AS id1, edges.id2 AS id2, edges.dist AS dist
				|FROM edges
				|JOIN points
				|	 ON points.id=edges.id1
				|WHERE id1 IN """.stripMargin
				+ idsWeWant.toString().substring(3))
			val result = Timer.time("DB", sql())

			idsWeHave ++= idsWeWant
			idsWeWant.clear()

			result.foreach(row => {

				val map = getMap(row)
					.map(a => {
						val (k, s) = a
						(k.substring(k.indexOf('.') + 1), s)
					})

				// create a new node entry if this departure point is new
				if (! edgeMap.contains(row[Long]("id1"))) {
					edgeMap += row[Long]("id1") -> (ListBuffer[Edge](), map)
				}

				edgeMap(row[Long]("id1"))._1 +=
			Edge(row[Long]("id1"), row[Long]("id2"), map)

				if (! edgeMap.contains(row[Long]("id2"))
					&& !idsWeHave.contains(row[Long]("id2"))) {

					// This destination has not been explored yet
					idsWeWant += row[Long]("id2")
				}
			})
		}

		val ns = ListBuffer[GraphNode]()
		var n : GraphNode = null
		edgeMap.foreach( (x:(Long, (ListBuffer[Edge], Map[String, Any]))) => {
			val (_k, (es, map)) = x
			val _n = new GraphNode(_k, es.toList, map)
			if (k==_k) n = _n
			ns += _n
		})

		(n, ns.toList)
	}
}`,
order: 1
}
