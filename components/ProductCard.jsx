import Link from "next/link";
import styles from "../styles/ProductCard.module.css";
import Image from "next/image";

const ProductLink = ({ id, children }) => (
  <Link href={`/products/${id}`}>
    <a className={styles.link}>{children}</a>
  </Link>
);

const ProductCard = (product) => {
  return (
    <div className={styles.container}>
      {product.image && (
        <ProductLink id={product._id}>
          <Image
            width={450}
            height={600}
            alt=""
            className={styles.image}
            src={product.image}
          />
        </ProductLink>
      )}
      <div className={styles.text}>
        <ProductLink id={product._id}>
          <p className={styles.title}>{product.name}</p>
        </ProductLink>
        {product.price && <p className={styles.price}>${product.price}</p>}
      </div>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductCard;
