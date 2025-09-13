/* SQL to preload major agricultural counties & towns - run in your DB */
INSERT INTO core_county(name) VALUES('Nakuru') ON CONFLICT DO NOTHING;