import { getGraphqlUsers } from "../services/graphql-api.js";
import { showStatus } from "../components/status-message.js";

export async function loadGraphqlView({
  status,
  onData,
  isCurrent = () => true,
}) {
  showStatus(status, "loading", "Querying GraphQLZero for users 1–10…");
  try {
    const result = await getGraphqlUsers();
    if (!isCurrent()) return;
    onData(result);
    if (result.errors.length) {
      showStatus(
        status,
        result.users.length ? "success" : "error",
        `${result.users.length} users loaded. Partial errors: ${result.errors.join(" · ")}`,
      );
    } else if (result.users.length)
      showStatus(status, "success", `Showing ${result.users.length} users`);
    else showStatus(status, "empty", "GraphQLZero returned no users.");
  } catch (error) {
    if (!isCurrent()) return;
    showStatus(
      status,
      "error",
      error.message || "The GraphQL query could not be completed.",
    );
  }
}
