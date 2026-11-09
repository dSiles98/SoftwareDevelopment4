import { element } from "../utils/dom.js";
import { createUserCard } from "./user-card.js";

export function createUserList() {
  const grid = element("section", "user-grid");
  grid.setAttribute("aria-label", "Users and posts");
  return grid;
}

export function renderUsers(grid, users) {
  grid.replaceChildren();
  for (const user of users) grid.append(createUserCard(user));
}
