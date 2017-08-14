IF EXISTS (SELECT * FROM next_ids WHERE name = '${name}') THEN
              UPDATE next_ids
              SET next_id = (c.next_id + c.incr)
              FROM (
                SELECT next_id, incr
                  FROM next_ids
                  WHERE name = '${name}') AS c
              WHERE name = '${name}';

            INSERT INTO id_ranges (name, range_start, range_end)
                SELECT name, next_id, next_id + incr
                FROM next_ids
                WHERE name = '${name}';

            SELECT next_id, incr FROM next_ids
              WHERE name = '${name}'

          ELSE

            INSERT INTO next_ids (name, next_id)
              VALUES ('${name}', 1001);

            INSERT INTO id_ranges (name, range_start, range_end)
              VALUES ( '${name}', 1, 1000 );

            SELECT * FROM next_ids WHERE name = '${name}';

          ENDIF
