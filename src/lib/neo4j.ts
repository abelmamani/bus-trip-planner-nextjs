import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
  process.env.NEO4J_URI as string,
  neo4j.auth.basic(
    process.env.NEO4J_USER as string,
    process.env.NEO4J_PASSWORD as string
  )
);

export default driver;
