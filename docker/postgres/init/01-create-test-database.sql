-- Runs once, when the volume is first initialised. Integration tests use this
-- database, so their cleanup can never touch the development data.
CREATE DATABASE identity_test;
