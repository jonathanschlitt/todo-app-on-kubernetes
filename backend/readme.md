## Database Preparation ##

- `Create TABLE user (
  id UUID PRIMARY KEY ,
  surname text,
  lastname text,
  email text,
  password text
  );`
- `Create TABLE todo (
  id UUID PRIMARY KEY,
  user_id UUID,
  name text,
  description text,
  active boolean,
  deadline text,
  showDetails boolean
  );`