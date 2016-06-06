--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.3
-- Dumped by pg_dump version 9.5.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: schools; Type: TABLE; Schema: public; Owner: Richard
--

CREATE TABLE schools (
    id integer NOT NULL,
    "schoolName" character varying(255),
    url character varying(255)
);


ALTER TABLE schools OWNER TO "Richard";

--
-- Name: schools_id_seq; Type: SEQUENCE; Schema: public; Owner: Richard
--

CREATE SEQUENCE schools_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE schools_id_seq OWNER TO "Richard";

--
-- Name: schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Richard
--

ALTER SEQUENCE schools_id_seq OWNED BY schools.id;


--
-- Name: technologies; Type: TABLE; Schema: public; Owner: Richard
--

CREATE TABLE technologies (
    id integer NOT NULL,
    "techName" character varying(255)
);


ALTER TABLE technologies OWNER TO "Richard";

--
-- Name: technologies_id_seq; Type: SEQUENCE; Schema: public; Owner: Richard
--

CREATE SEQUENCE technologies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE technologies_id_seq OWNER TO "Richard";

--
-- Name: technologies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Richard
--

ALTER SEQUENCE technologies_id_seq OWNED BY technologies.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY schools ALTER COLUMN id SET DEFAULT nextval('schools_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY technologies ALTER COLUMN id SET DEFAULT nextval('technologies_id_seq'::regclass);


--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: Richard
--

COPY schools (id, "schoolName", url) FROM stdin;
1	Hack Reactor	http://www.hackreactor.com/
2	MakerSquare	https://www.makersquare.com/
3	Dev Bootcamp	http://devbootcamp.com/
4	App Academy	https://www.appacademy.io/
5	Galvanize	http://www.galvanize.com/
6	Mobile Makers Academy	http://mobilemakers.co/
7	Hack Reactor Remote Beta	http://www.hackreactor.com/remote-beta/
8	Telegraph Academy	http://www.telegraphacademy.com/
9	The Iron Yard	https://www.theironyard.com/
10	Epicodus	http://www.epicodus.com/
11	RefactorU	http://www.refactoru.com/
12	DevMountain	https://devmounta.in/
13	The Flatiron School	http://flatironschool.com/
14	Code Fellows	https://www.codefellows.org/
15	freeCodeCamp	https://www.freecodecamp.com/
16	Anyone Can Learn to Code	http://anyonecanlearntocode.com/
17	Fullstack Academy	http://www.fullstackacademy.com/
18	General Assembly	https://generalassemb.ly/
\.


--
-- Name: schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Richard
--

SELECT pg_catalog.setval('schools_id_seq', 1, false);


--
-- Data for Name: technologies; Type: TABLE DATA; Schema: public; Owner: Richard
--

COPY technologies (id, "techName") FROM stdin;
2	AngularJS 1
3	Node.js
1	React
5	Backbone.js
4	Express
6	React Native
7	D3.js
8	Redux
9	Angular 2
10	Knex.js
11	JavaScript
12	jQuery
13	Bootstrap
14	Material Design
15	PostgreSQL
16	MongoDB
17	Mongoose
18	PassportJS
19	Socket.io
20	Docker
21	webpack.js
22	MySQL
23	Redis
24	Meteor
\.


--
-- Name: technologies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Richard
--

SELECT pg_catalog.setval('technologies_id_seq', 1, false);


--
-- Name: schools_pkey; Type: CONSTRAINT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: schools_schoolname_unique; Type: CONSTRAINT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY schools
    ADD CONSTRAINT schools_schoolname_unique UNIQUE ("schoolName");


--
-- Name: technologies_pkey; Type: CONSTRAINT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY technologies
    ADD CONSTRAINT technologies_pkey PRIMARY KEY (id);


--
-- Name: technologies_techname_unique; Type: CONSTRAINT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY technologies
    ADD CONSTRAINT technologies_techname_unique UNIQUE ("techName");


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

