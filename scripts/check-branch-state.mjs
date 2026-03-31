import { execFileSync } from "child_process";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

function git(args, options = {}) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  }).trim();
}

function tryGit(args) {
  try {
    return git(args);
  } catch {
    return null;
  }
}

function refExists(ref) {
  return tryGit(["rev-parse", "--verify", ref]) !== null;
}

function shortHash(ref) {
  return tryGit(["rev-parse", "--short", ref]) ?? "missing";
}

function commitDate(ref) {
  return tryGit(["show", "-s", "--format=%ci", ref]) ?? "missing";
}

function subject(ref) {
  return tryGit(["show", "-s", "--format=%s", ref]) ?? "missing";
}

function aheadBehind(left, right) {
  const output = tryGit(["rev-list", "--left-right", "--count", `${left}...${right}`]);
  if (!output) {
    return null;
  }

  const [ahead = "0", behind = "0"] = output.split(/\s+/);
  return {
    ahead: Number(ahead),
    behind: Number(behind),
  };
}

function printRef(label, ref) {
  if (!refExists(ref)) {
    console.log(`${label}: missing`);
    return;
  }

  console.log(`${label}: ${shortHash(ref)}  ${commitDate(ref)}`);
  console.log(`  ${subject(ref)}`);
}

const currentBranch = git(["branch", "--show-current"]);
const dirty = tryGit(["status", "--short"]);

console.log("Trophy Cast Site Git Status");
console.log("===========================");
console.log(`Current branch: ${currentBranch || "detached HEAD"}`);
console.log(`Working tree: ${dirty ? "dirty" : "clean"}`);

if (dirty) {
  console.log("\nUncommitted changes:");
  console.log(dirty);
}

console.log("\nTracked refs:");
printRef("local/dev", "dev");
printRef("origin/dev", "origin/dev");
printRef("local/main", "main");
printRef("origin/main", "origin/main");

console.log("\nDivergence:");
for (const [left, right] of [["dev", "origin/dev"], ["main", "origin/main"]]) {
  const result = aheadBehind(left, right);
  if (!result) {
    console.log(`${left} vs ${right}: unavailable`);
    continue;
  }

  console.log(`${left} vs ${right}: ahead ${result.ahead}, behind ${result.behind}`);
}

const mainVsRemote = aheadBehind("main", "origin/main");
const devVsRemote = aheadBehind("dev", "origin/dev");

console.log("\nInterpretation:");
if (mainVsRemote && mainVsRemote.behind > 0) {
  console.log(`- Local main is stale by ${mainVsRemote.behind} commit(s). Do not use it as your truth source until you sync.`);
}
if (devVsRemote && devVsRemote.ahead === 0 && devVsRemote.behind === 0) {
  console.log("- Local dev matches origin/dev.");
}
if (currentBranch === "main" && mainVsRemote && mainVsRemote.behind > 0) {
  console.log("- You are currently on a stale main branch. Switch to dev or sync main before validating the site.");
}
if (currentBranch !== "main" && currentBranch !== "dev") {
  console.log(`- You are on ${currentBranch}. Confirm whether this branch is the one you intend to preview.`);
}

const currentVsRemote = currentBranch ? aheadBehind(currentBranch, `origin/${currentBranch}`) : null;
if (currentVsRemote && currentVsRemote.ahead === 0 && currentVsRemote.behind === 0) {
  console.log(`- Current branch ${currentBranch} is aligned with origin/${currentBranch}.`);
}

console.log("\nNext check:");
console.log("- If the site looks wrong, compare the page against your deployed commit in Vercel before changing code.");

// Hard-fail guard: if running on stale local main, stop the dev server from starting
// so you never accidentally diagnose content from an outdated local snapshot.
if (
  process.env.GUARD_STALE_MAIN !== "0" &&
  currentBranch === "main" &&
  mainVsRemote !== null &&
  mainVsRemote.behind > 0
) {
  console.error("\n\u274C GUARD: Local main is stale by " + mainVsRemote.behind + " commit(s).");
  console.error("  The site you'd preview here does NOT match production.");
  console.error("  Run: git pull origin main  — then try again.");
  console.error("  To bypass (not recommended): set GUARD_STALE_MAIN=0 before your command.");
  process.exit(1);
}