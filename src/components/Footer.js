const Footer = () => {
  const styles = {
    footer: {
      marginTop: "40px",
      padding: "25px",
      backgroundColor: "#111",
      color: "#aaa",
      textAlign: "center"
    },
    brand: {
      color: "#fff",
      fontWeight: "bold",
      marginBottom: "6px"
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.brand}>MARTIQ</div>
      <div>© {new Date().getFullYear()} MARTIQ. All rights reserved.</div>
    </footer>
  );
};

export default Footer;