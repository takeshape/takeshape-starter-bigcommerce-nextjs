import Error from "next/error";
import TakeShape, { gql } from "../../takeshape.client";
import styles from "../../styles/Product.module.css";
import { squashProduct } from "..";
import Image from "next/image";

const Product = (product) => {
  product = squashProduct(product);
  return (
    <div className={styles.container}>
      {product.image && (
        <div className={styles.image}>
          <Image width={900} height={1200} alt="" src={product.image} />
        </div>
      )}
      <div className={styles.text}>
        <h2>{product.name}</h2>
        <p>${product.price}</p>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      </div>
      <p>{product.description}</p>
    </div>
  );
};

export default function ProductPage(props) {
  const { data, errors } = props;
  if (errors) {
    return <Error statusCode={500} />;
  } else if (!data) {
    return <Error statusCode={404} />;
  }
  return <Product {...data.product} />;
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const res = {
    props: {
      data: null,
      errors: null,
    },
  };
  try {
    const query = gql`
      query singleProduct($id: ID!) {
        product: getProduct(_id: $id) {
          _id
          name
          customDescription
          productId: bigCommerceProductId
          product: bigCommerceData {
            name
            images(first: 1) {
              edges {
                node {
                  url(width: 1200, height: 800)
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  prices {
                    price {
                      value
                    }
                  }
                  entityId
                }
              }
            }
          }
        }
      }
    `;
    const variables = { id };
    res.props.data = await TakeShape.graphql(query, variables);
    return res;
  } catch (error) {
    console.error(error);
    res.props.errors = [error.message];
  }
  return res;
}

export async function getStaticPaths() {
  let paths = [];
  try {
    const query = gql`
      query {
        products: getProductList(onlyEnabled: false) {
          items {
            _id
          }
        }
      }
    `;
    const data = await TakeShape.graphql(query);
    const createPath = (item) => ({ params: { id: item._id } });
    paths = data.products.items.map(createPath);
  } catch (error) {
    console.error(error);
  }
  return { paths, fallback: true };
}
