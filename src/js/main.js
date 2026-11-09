import { element } from "./utils/dom.js";
import { clearCache } from "./utils/cache.js";
import { currentRoute, navigate, subscribeRoute } from "./router/router.js";
import { createAppHeader } from "./components/app-header.js";
import { createUserList, renderUsers } from "./components/user-list.js";
import { showStatus } from "./components/status-message.js";
import { loadRestView } from "./views/users-rest-view.js";
import { loadGraphqlView } from "./views/users-graphql-view.js";

const app = document.querySelector("#app");
const shell = element("div", "mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8");
const { header, restLink, graphqlLink: gqlLink } = createAppHeader();

const main = element("main", "pt-8");
const hero = element(
  "section",
  "mb-6 flex flex-col gap-5 rounded-3xl border border-neutral-300 bg-white p-6 text-neutral-900 sm:p-8 lg:flex-row lg:items-end lg:justify-between",
);
const heroCopy = element("div", "max-w-3xl");
heroCopy.append(
  element(
    "p",
    "text-xs font-bold uppercase tracking-[.22em] text-neutral-500",
    "",
  ),
  element("h1", "mt-3 font-bold tracking-tight", "Users and posts"),
  element(
    "p",
    "mt-3 text-sm leading-6 text-neutral-600 sm:text-base",
    "A practical demonstration of how REST and GraphQL retrieve and relate the same data.",
  ),
);
const actions = element("div", "flex flex-wrap gap-2");
const refreshButton = element(
  "button",
  "rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-bold text-neutral-900 transition hover:bg-neutral-100",
  "Fetch again",
);
refreshButton.type = "button";
const clearButton = element(
  "button",
  "rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100",
  "Clear cache",
);
clearButton.type = "button";
hero.append(heroCopy, actions);

const sectionHeader = element(
  "section",
  "mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
);
const headingBox = element("div");
const title = element("h2", "font-bold tracking-tight text-neutral-900");
const description = element(
  "p",
  "mt-1 max-w-3xl text-sm leading-6 text-neutral-600",
);
headingBox.append(title, description);
const serviceBadge = element(
  "span",
  "inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700",
);
sectionHeader.append(headingBox, serviceBadge);
const status = element("div", "mb-4");
const users = createUserList();

main.append(hero, sectionHeader, status, users);
shell.append(header, main);
app.replaceChildren(shell);

let activeController = 0;
function routeClick(event) {
  const link = event.target.closest("a[data-route]");
  if (
    !link ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  event.preventDefault();
  navigate(link.dataset.route);
}
app.addEventListener("click", routeClick);
subscribeRoute(() => renderRoute());
refreshButton.addEventListener("click", () => renderRoute(true));
clearButton.addEventListener("click", () => {
  clearCache();
  renderRoute(false, "In-memory cache cleared.");
});

async function renderRoute(forceNetwork = false, notice = "") {
  const callId = ++activeController;
  const route = currentRoute();
  const isGraphql = route === "graphql";
  restLink.className = linkClasses(!isGraphql);
  gqlLink.className = linkClasses(isGraphql);
  if (isGraphql) restLink.removeAttribute("aria-current");
  else restLink.setAttribute("aria-current", "page");
  if (isGraphql) gqlLink.setAttribute("aria-current", "page");
  else gqlLink.removeAttribute("aria-current");
  title.textContent = isGraphql ? "Users with GraphQL" : "Users with REST";
  description.textContent = isGraphql
    ? "Parameterized queries retrieve users and their related posts from GraphQLZero in two phases."
    : "Two independent GET requests retrieve users and posts; the browser relates them by userId.";
  serviceBadge.replaceChildren(element("span", ""));
  users.replaceChildren();
  if (notice) showStatus(status, "success", notice);
  const callbacks = {
    status,
    onData(result) {
      if (callId !== activeController) return;
      renderUsers(users, result.users);
    },
    forceNetwork,
    isCurrent: () => callId === activeController,
  };
  if (isGraphql) await loadGraphqlView(callbacks);
  else await loadRestView(callbacks);
}
function linkClasses(active) {
  return `rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 ${active ? "border-neutral-900 bg-neutral-900 text-white" : "border-transparent text-neutral-600 hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900"}`;
}

renderRoute();
