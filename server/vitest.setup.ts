process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ||= 'postgres://deepletter:deepletter@localhost:5432/deepletter_test';
process.env.WEB_ORIGIN ||= 'http://localhost:3000';
