-- MedTrust Maps — Extensions
-- Run via: mcp__insforge__run-raw-sql
CREATE EXTENSION IF NOT EXISTS postgis;     -- GEOGRAPHY + radius queries
CREATE EXTENSION IF NOT EXISTS pgcrypto;    -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS vector;      -- pgvector (roadmap v1.1)
