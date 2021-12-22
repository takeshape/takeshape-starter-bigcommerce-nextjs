import Error from "next/error";
import TakeShape, { gql, getImageUrl } from "../takeshape.client";
import styles from "../styles/Home.module.css";
import ProductCard from "../components/ProductCard";
import Image from "next/image";

// Flatten product, image, and variant info into one useful object
export function squashProduct(product) {
  return {
    ...product.product,
    descriptionHTML: product.product.description,
    description: product.customDescription,
    price: product.product.variants?.edges[0]?.node.prices.price.value,
    image: product.product.images?.edges[0]?.node?.url,
    ...product,
  };
}

const Look = ({ photo, text, products }) => {
  products = products.map(squashProduct);
  return (
    <div className={styles.look}>
      <div className={styles.photo}>
        <Image
          alt=""
          width={900}
          height={1200}
          src={getImageUrl(photo.path, { w: 900, h: 1200, fit: "crop" })}
        />
      </div>
      <div className={styles.details}>
        <div
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: text }}
        />
        <div className={styles.products}>
          {products.map((product) => (
            <ProductCard {...product} key={product._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Home(props) {
  const { data, errors } = props;

  if (errors && errors.length > 0) {
    return <Error statusCode={500} />;
  } else if (!data) {
    return <Error statusCode={404} />;
  }
  const looks = data.looks.items;
  return (
    <div className={styles.container}>
      {looks.map((look) => (
        <Look key={look._id} {...look} />
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const res = {
    props: {
      data: null,
      errors: null,
    },
  };
  try {
    const query = gql`
      query {
        looks: getLookList {
          items {
            _id
            name
            text: textHtml
            photo {
              path
            }
            products {
              _id
              name
              customDescription
              productId: bigCommerceProductId
              product: bigCommerceData {
                name
                description
                images(first: 1) {
                  edges {
                    node {
                      url(height: 800, width: 1200)
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
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
        }
      }
    `;
    res.props.data = await TakeShape.graphql(query);
  } catch (error) {
    console.error(error);
    res.props.errors = [error.message];
  }
  return res;
}
