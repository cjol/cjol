module.exports =
{
	"name": "Mabel",
	"slug": "mabel",
	date: new Date().getTime(),
	"languages": ["Javascript", "SQL"],
	"img": "/img/screenshots/mabel.png",
	"desc": "Highly resilient event ticketing system, designed to withstand spikes of demand at release time",
	"description": `
	<p>
		May Balls at Cambridge are exciting things. Thousands of people each pay over £100 per ticket, leading to huge spikes of demand on the servers processing tickets.
		Despite this, they are organised by non-technical committees. I built Mabel to help these non-technical users to run their own ticketing system -- built to handle
		all the ideosyncracies of May Ball ticketing -- without needing to worry about it crashing after launch.
	</p>
	<p>
		Free hosting for these kinds of purposes is provided by the Student-run Computing Facility, which dictated my choice of stack. MySQL is used for
		data storage, though I chose to use Node rather than the preferred PHP. For particularly large events, I deployed Mabel across a multicore cluster on AWS,
		behind an NGINX proxy used for load balancing.
	</p>
	`,
	"codeDescription": `Tickets for these events often run out within seconds, which means that there is a very real risk of race conditions.
	Rather than block execution to provide consistency, I came up with a way to take advantage of MySQL's natural per-query atomicity. By combining
	both the check for available tickets with the actual insertion into a single query, we can be sure that the view will be consistent. I am
	particularly proud of this SQL query!`,
	"codeLanguage": "sql",
	"code":
`
/* insert tickets one at a time to make sure we don't go over.
It works by selecting our set of values once for each row in the inner SELECT'd table.
NB - it does not take into account user allowances
*/
DROP PROCEDURE IF EXISTS safe_add_ticket//
CREATE PROCEDURE safe_add_ticket (
	IN _user_id int,
	IN _ticket_type_id int,
	IN _guest_name varchar(128),
	IN _donation boolean,
	IN _payment_method_id int,
	IN _transaction_value DECIMAL(6,2))

BEGIN
	INSERT INTO ticket (
		user_id,
		ticket_type_id,
		guest_name,
		donation,
		transaction_value,
		payment_method_id,
		status,
		book_time)

	-- prepare the row of data we'd like to insert. "SELECT" will pull out a
	-- row of values once for each row in a given table. Here we're hacking this
	-- slightly by providing a row of constant values to use, and MySQL will
	-- repeat it once for each row in the inner table. We make the inner table
	-- have either 1 or 0 rows.
	SELECT
		_user_id,
		_ticket_type_id,
		_guest_name,
		_donation,
		_transaction_value,
		_payment_method_id,
		'PENDING',
		UNIX_TIMESTAMP()
	FROM
		-- this table will have 1 row with 1 value: the number of tickets sold
		(SELECT COUNT(*) sold
			FROM ticket
			WHERE
				ticket_type_id = _ticket_type_id
				AND (
					status = 'PENDING' OR
					status = 'CONFIRMED' OR
					status = 'ADMITTED'
				)
		) A

		JOIN

		-- this table will also have 1 row with 1 value: the limit for this type
		(SELECT total_limit cap
			FROM ticket_type
			WHERE id = _ticket_type_id
		) B

		JOIN

		-- this table will also have 1 row with 1 value: the size of the waiting list
		(SELECT COUNT(*) AS wl
			FROM ticket
			WHERE
				ticket_type_id = _ticket_type_id AND
				status = 'PENDING_WL'
		) C

	-- if we've sold up to the limit or there are people waiting, then this
	-- condition is false, and we select 0 rows instead of 1 as planned.
	-- Nothing gets inserted.
	WHERE
		B.cap > A.sold AND
		C.wl < 1;

	-- Finally return details to the caller so they know what happened
	-- N.B. The insert ID is maintained in the server on a per-connection basis. 
	SELECT LAST_INSERT_ID() AS insertId, ROW_COUNT() AS rowsAffected;
END//
`,
}
