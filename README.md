# ldapRoster

A query to get list of netids in the course AD group

# .env file

```
ADUSER="netid@illinois.edu"
ADPASSWORD="password_in_plaintext:("
ADGROUP="cs-225-stu"
```

# Groups

These AD groups are the same ones accessed through https://my.engr.illinois.edu/classtools/

- Students: `RUBRIC-NUMBER-stu`
-- Wrap-up group of all students in all sections of the course, plus auditors added
- Staff: `RUBRIC-NUMBER-stf`
- Graders: `RUBRIC-NUMBER-grd`

i.e. `cs-225-stu`, `cs-225-grd`, `cs-225-stf`

Anyone in the staff or grader group can see the members of the other AD groups for the same course.

# Running

If you haven't initialized the dependencies, run this in the same directory as `roster.js`:

```
npm install
```

Then configure a `.env` file as described above with your credentials. To run the script, run:

```
node roster
```

or

```
node roster <ADGROUP to look up>
```
(i.e. `node roster cs-225-stu`)

Output is a list of netids in the group, if it's populated and if you have permission to view it.
