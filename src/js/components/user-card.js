import { element } from "../utils/dom.js";
import { createPostList } from "./post-list.js";

export function createUserCard(user) {
  const card = element(
    "article",
    "overflow-hidden rounded-2xl border border-neutral-200 bg-white",
  );
  const top = element("div", "border-b border-neutral-200 p-5");
  top.append(
    element(
      "p",
      "mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500",
      `User ${user.id}`,
    ),
  );
  top.append(
    element(
      "h3",
      "font-bold text-neutral-900",
      user.name || user.username || "Name unavailable",
    ),
  );
  top.append(
    element(
      "p",
      "mt-1 break-all text-sm text-neutral-600",
      user.email || "Email unavailable",
    ),
  );
  if (user.phone)
    top.append(
      element(
        "p",
        "mt-2 break-words text-sm text-neutral-600",
        `Phone: ${user.phone}`,
      ),
    );
  if (user.website)
    top.append(
      element(
        "p",
        "mt-1 break-all text-sm text-neutral-600",
        `Website: ${user.website}`,
      ),
    );
  if (user.geo)
    top.append(
      element(
        "p",
        "mt-3 text-xs text-neutral-500",
        `Coordinates: ${user.geo.lat}, ${user.geo.lng}`,
      ),
    );
  const content = element("div", "p-5");
  content.append(
    element(
      "h4",
      "text-sm font-semibold text-neutral-700",
      `${user.posts.length} posts`,
    ),
    createPostList(user),
  );
  card.append(top, content);
  return card;
}
