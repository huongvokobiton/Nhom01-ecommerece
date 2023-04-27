const neo4j = require("neo4j-driver");

const host = process.env.GRAPH_DB_HOST || "";
const username = process.env.GRAPH_DB_USERNAME || "neo4j";
const password = process.env.GRAPH_DB_PASSWORD || "";

const connectDatabase = () => {
  // CheckProduct(driver);
};

const CheckProduct = (driver) => {
  const query = `
    MATCH (a:PERSON)-[:PURCHASED]->(p:PRODUCT)<-[:PURCHASED]-(b:PERSON)
    WHERE a.name = 'Huong' AND b.name = 'B'
    WITH b, collect(p.id) AS purchased_products
    MATCH (b:PERSON)-[:PURCHASED]->(product:PRODUCT)
    WHERE NOT product.id IN purchased_products
    RETURN product.name`;

  const params = { limit: "10" };

  session
    .run(query, params)
    .then((result) => {
      console.log("Connected to Neo4j Database successfully");
      // result.records.forEach((record) => {
      //     console.log(record);
      // });
      console.log(result);
    })
    .catch((error) => {
      console.log("Connecting to Neo4j Database failed with error", error);
    });
};

const createRelationship = async (
  label1,
  property1,
  label2,
  property2,
  quantity
) => {
  const driver = neo4j.driver(host, neo4j.auth.basic(username, password));
  const session = driver.session();

  const query = `
      MATCH (a{${label1}:${property1}}), (b{${label2}:${property2}})
      MERGE (a)-[:PURCHASED {quantity: ${quantity}}]->(b)
      RETURN a, b
    `;
  console.log(query);
  try {
    const result = await session.run(query, {
      label1,
      property1,
      label2,
      property2,
      quantity,
    });

    return result;
  } catch (error) {
    throw new Error(error);
  } finally {
    driver.close();
    session.close();
  }
};

const getPromotedProducts = async (currentUserId, relatedUserId) => {
  let driver = neo4j.driver(host, neo4j.auth.basic(username, password));
  let session = driver.session();

  // Câu truy vấn cần thực hiện
  const query = `
  MATCH (a:PERSON)-[:PURCHASED]->(p:PRODUCT)<-[:PURCHASED]-(b:PERSON)
  WHERE a._id = $personAName AND b._id = $personBName
  WITH b, collect(p.id) AS purchased_products
  MATCH (b:PERSON)-[:PURCHASED]->(product:PRODUCT)
  WHERE NOT product.id IN purchased_products
  RETURN product.id
`;

  // Thực hiện truy vấn và lấy kết quả
  try {
    const result = await session
    .run(query, { personAName: currentUserId, personBName: relatedUserId })

    //return ['Rau củ hỗn hợp cắt sẵn đông lạnh NTFood gói 1kg / 500g - Nhất Tín Food'];
    
    return result?.records.map(el => el._fields) || []
  } catch (error) {
    throw new Error(error);
  } finally {
    driver.close();
    session.close();
  }
};

module.exports = { connectDatabase, createRelationship, getPromotedProducts };
