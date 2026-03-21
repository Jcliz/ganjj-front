import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { SearchPage } from "./pages/SearchPage";
import { AboutPage } from "./pages/AboutPage";
import { StoresPage } from "./pages/StoresPage";
import { ListingPage } from "./pages/ListingPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";

export const router = createBrowserRouter([
  { path: "/",               Component: LandingPage       },
  { path: "/search",         Component: SearchPage        },
  { path: "/about",          Component: AboutPage         },
  { path: "/stores",         Component: StoresPage        },
  { path: "/listing",        Component: ListingPage       },
  { path: "/product/:id",    Component: ProductDetailPage },
]);
