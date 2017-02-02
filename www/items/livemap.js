module.exports =
{
	"name": "Livemap",
	"slug": "livemap",
	"languages": ["Javascript", "Clojure", "Java"],
	"img": "/img/screenshots/livemap.png",
	"desc": "High-throughput streaming system to process live mouse-movements and calculate a heatmap of activity",
	"description": `
<p>
	For part of my master's course on Distributed Systems & Data Processing, we were asked to run a small research
	project using any of the surveyed technologies. I chose to look at Storm.
</p>
<p>
	In particular, I built a system to generate live heatmaps of activity from any webpage. The challenge here is that
	there is a constant stream of mouse-movements coming from any connected client, and the data volume quickly gets very
	big as more and more clients connect. This is why I chose to use Storm, which is designed to handle high-volume
	streams of data.
</p>
`,
	"codeDescription": `
Perhaps foolishly, I decided to learn a brand new language alongside learning about a brand new technology stack in Storm.
I struggled to get to grips with Clojure as my deadline loomed, with the result that I fell back to Java for some of the
project's classes. Hurray for interop! I nevertheless have included a sample of my Clojure below, mainly to show off my
excellent LISP indentation skills.`,
	"codeLanguage": "clojure",
	"code": `
(ns testclj
  (:use backtype.storm.clojure backtype.storm.config)
  (:require [clojure.java.io])
  (:refer [clojure.java.io])
  (:gen-class)
  (:import [backtype.storm LocalCluster LocalDRPC]
           [clojure.java.io]))


(defspout word-spout ["sentence"]
          [conf context collector]
          (let [completed (atom true)]
            (spout
              (nextTuple []
                         (with-open [rdr (reader "/tmp/test.txt")]
                           (doseq [line (line-seq rdr)]
                             (println line)))
                         ;; nextTuple is called repeatedly, so avoid CPU spam with timeout
                         (Thread/sleep 100)
                         ;; in this case I only ever want to call this once
                         (if (deref completed)
                             (do
                               (println (str "Time for more fun? " (deref completed)))
                               (emit-spout! collector [ans])
                               ;; \`not\` will be called to update the value of \`completed\` (to false)
                               (swap! completed not)))))))


(defbolt print-bolt ["word"] [tuple collector]
         (println (str "HELLO THE WORD IS HERE: " (.getString tuple 0)))
         (ack! collector tuple))

(defn mk-topology []
  (topology

    ;; spout definitions
    {"1" (spout-spec word-spout :p 1)}

    ;; bolt definitions
    {"2" (bolt-spec
           {"1" :shuffle}
           print-bolt :p 1)}))

(defn run-local! []
  (let [cluster (LocalCluster.)]
    (println "Submitting")
    (.submitTopology cluster "word-count" {TOPOLOGY-DEBUG false} (mk-topology))
    (Thread/sleep 5000)
    (println "Shutting down")
    (.shutdown cluster)))

(defn -main
  "Run the Storm topology locally for testing"
  [& args]
  (run-local!))
`,
order: 3
}
