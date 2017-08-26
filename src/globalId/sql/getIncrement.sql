 INSERT INTO next_ids (name, next_id, incr)
       VALUES ('${name}', ${incr} + 1, ${incr})
       ON CONFLICT (name) DO UPDATE SET next_id = next_ids.next_id + next_ids.incr;

      INSERT INTO id_ranges (name, range_start, range_end)
        SELECT name, next_id - incr -1, next_id - 1
          FROM next_ids
          WHERE name = '${name}'
          RETURNING range_start, range_end;
