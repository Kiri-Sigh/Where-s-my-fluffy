import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.jsx", [
    index("routes/home.tsx"),
    route("map", "routes/test_map2.jsx", []),
    route("login", "component/login_page.jsx"),
    route("register", "component/register_page.jsx"),

    route("*", "routes/empty/not_found.jsx"),
  ]),
] satisfies RouteConfig;
