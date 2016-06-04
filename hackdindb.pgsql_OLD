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
-- Name: engineers; Type: TABLE; Schema: public; Owner: Richard
--

CREATE TABLE engineers (
    id integer NOT NULL,
    "gitHandle" character varying(255),
    name character varying(255),
    email character varying(255),
    bio character varying(255),
    "githubUrl" character varying(255),
    "linkedinUrl" character varying(255),
    image character varying(255),
    project_id integer,
    school_id integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE engineers OWNER TO "Richard";

--
-- Name: engineers_id_seq; Type: SEQUENCE; Schema: public; Owner: Richard
--

CREATE SEQUENCE engineers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE engineers_id_seq OWNER TO "Richard";

--
-- Name: engineers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Richard
--

ALTER SEQUENCE engineers_id_seq OWNED BY engineers.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: Richard
--

CREATE TABLE projects (
    id integer NOT NULL,
    title character varying(255),
    description character varying(255),
    image character varying(255),
    "projectUrl" character varying(255),
    school_id integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE projects OWNER TO "Richard";

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: Richard
--

CREATE SEQUENCE projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE projects_id_seq OWNER TO "Richard";

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Richard
--

ALTER SEQUENCE projects_id_seq OWNED BY projects.id;


--
-- Name: projects_technologies; Type: TABLE; Schema: public; Owner: Richard
--

CREATE TABLE projects_technologies (
    id integer NOT NULL,
    project_id integer,
    technology_id integer
);


ALTER TABLE projects_technologies OWNER TO "Richard";

--
-- Name: projects_technologies_id_seq; Type: SEQUENCE; Schema: public; Owner: Richard
--

CREATE SEQUENCE projects_technologies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE projects_technologies_id_seq OWNER TO "Richard";

--
-- Name: projects_technologies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Richard
--

ALTER SEQUENCE projects_technologies_id_seq OWNED BY projects_technologies.id;


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
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE sessions (
    sid character varying(255) NOT NULL,
    sess json NOT NULL,
    expired timestamp with time zone NOT NULL
);


ALTER TABLE sessions OWNER TO postgres;

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

ALTER TABLE ONLY engineers ALTER COLUMN id SET DEFAULT nextval('engineers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY projects ALTER COLUMN id SET DEFAULT nextval('projects_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY projects_technologies ALTER COLUMN id SET DEFAULT nextval('projects_technologies_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY schools ALTER COLUMN id SET DEFAULT nextval('schools_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY technologies ALTER COLUMN id SET DEFAULT nextval('technologies_id_seq'::regclass);


--
-- Data for Name: engineers; Type: TABLE DATA; Schema: public; Owner: Richard
--

COPY engineers (id, "gitHandle", name, email, bio, "githubUrl", "linkedinUrl", image, project_id, school_id, created_at, updated_at) FROM stdin;
4	kamalmango	Kamal Mango	kamal.mango7@gmail.com	\N	https://github.com/kamalmango	\N	https://res.cloudinary.com/hackdin/image/upload/c_fill,r_5,w_250/v1465012962/11984827_e6f8ve.jpg	1	2	\N	\N
3	vickeetran	Victoria Tran	ptran.vicki@gmail.com	\N	https://github.com/vickeetran	\N	https://res.cloudinary.com/hackdin/image/upload/c_fill,h_250,r_5,w_250/v1465012954/10315399_jws0en.jpg	2	4	\N	\N
1	mybrainishuge	Richard May	richardamay@gmail.com	\N	https://github.com/mybrainishuge	\N	https://res.cloudinary.com/hackdin/image/upload/c_fill,h_250,r_5,w_250/v1465012928/10822210_kki4kg.jpg	1	2	\N	\N
2	justin-lai	Justin Lai	justin.th.lai@gmail.com	\N	https://github.com/justin-lai	\N	https://res.cloudinary.com/hackdin/image/upload/c_fill,r_5,w_250/v1465012945/16922334_xehnlh.jpg	3	1	\N	\N
\.


--
-- Name: engineers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Richard
--

SELECT pg_catalog.setval('engineers_id_seq', 1, true);


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: Richard
--

COPY projects (id, title, description, image, "projectUrl", school_id, created_at, updated_at) FROM stdin;
1	hackd.in	Centralized database of bootcamp graduate projects	https://res.cloudinary.com/hackdin/image/upload/c_fit,h_250,r_5,w_250/v1465009032/cbdeov4kafwfiuznnnal.png	\N	2	\N	\N
2	Big Dogs	Exhaustive list of large dogs	https://res.cloudinary.com/hackdin/image/upload/c_fill,h_250,r_5,w_250/v1465008901/jjnyycfjhy0e16nio9bq.jpg	\N	4	\N	\N
3	Food	This is food	https://res.cloudinary.com/hackdin/image/upload/c_fit,h_250,r_5,w_250/v1465009156/mwtl0gemwps3zuwgzxmr.jpg	\N	1	\N	\N
\.


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Richard
--

SELECT pg_catalog.setval('projects_id_seq', 7, true);


--
-- Data for Name: projects_technologies; Type: TABLE DATA; Schema: public; Owner: Richard
--

COPY projects_technologies (id, project_id, technology_id) FROM stdin;
1	1	1
2	1	3
3	1	4
4	1	10
5	1	11
6	1	12
7	1	13
8	1	15
9	1	18
10	2	2
11	2	4
12	2	3
13	2	16
14	3	7
15	3	13
16	3	15
\.


--
-- Name: projects_technologies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Richard
--

SELECT pg_catalog.setval('projects_technologies_id_seq', 1, true);


--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: Richard
--

COPY schools (id, "schoolName", url) FROM stdin;
1	Hack Reactor	http://www.hackreactor.com/
2	MakerSquare	https://www.makersquare.com/
3	Dev Bootcamp	http://devbootcamp.com/
4	App Academy	https://www.appacademy.io/
5	Galvanize	http://www.galvanize.com/
\.


--
-- Name: schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Richard
--

SELECT pg_catalog.setval('schools_id_seq', 1, false);


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY sessions (sid, sess, expired) FROM stdin;
C5SSTofc5ImyButMyx5v4Ao2wFzJABoW	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"passport":{}}	2016-06-04 23:11:40.033-07
\.


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
\.


--
-- Name: technologies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Richard
--

SELECT pg_catalog.setval('technologies_id_seq', 1, false);


--
-- Name: engineers_githandle_unique; Type: CONSTRAINT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY engineers
    ADD CONSTRAINT engineers_githandle_unique UNIQUE ("gitHandle");


--
-- Name: engineers_pkey; Type: CONSTRAINT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY engineers
    ADD CONSTRAINT engineers_pkey PRIMARY KEY (id);


--
-- Name: projects_pkey; Type: CONSTRAINT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects_technologies_pkey; Type: CONSTRAINT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY projects_technologies
    ADD CONSTRAINT projects_technologies_pkey PRIMARY KEY (id);


--
-- Name: projects_title_unique; Type: CONSTRAINT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_title_unique UNIQUE (title);


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
-- Name: sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


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
-- Name: engineers_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY engineers
    ADD CONSTRAINT engineers_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects(id);


--
-- Name: engineers_school_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY engineers
    ADD CONSTRAINT engineers_school_id_foreign FOREIGN KEY (school_id) REFERENCES schools(id);


--
-- Name: projects_school_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_school_id_foreign FOREIGN KEY (school_id) REFERENCES schools(id);


--
-- Name: projects_technologies_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY projects_technologies
    ADD CONSTRAINT projects_technologies_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects(id);


--
-- Name: projects_technologies_technology_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: Richard
--

ALTER TABLE ONLY projects_technologies
    ADD CONSTRAINT projects_technologies_technology_id_foreign FOREIGN KEY (technology_id) REFERENCES technologies(id);


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

