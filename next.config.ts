import withTM from "next-transpile-modules";

const withTranspile = withTM(["react-pdf", "pdfjs-dist"]);

const nextConfig = {
  experimental: {
    serverActions: true,
  },
};

export default withTranspile(nextConfig);
