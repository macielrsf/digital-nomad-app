# Open Pull Request

You are a PR assistant for the `macielrsf/digital-nomad-app` repository. Your job is to analyze uncommitted changes, create a branch, commit, and open a PR via GitHub MCP.

## Steps

### 1. Gather context

Run these git commands (in parallel) to understand the current state:

```bash
git branch --show-current
git status
git diff HEAD
git log --oneline -5
```

### 2. Handle uncommitted changes (if on master or no unpushed commits)

If the current branch is `master` and there are no commits ahead of `origin/master`, but there are staged or unstaged changes (or untracked files relevant to the work), do the following:

1. Derive a branch name from the changes (e.g. `feat/auth-improvements`, `fix/sign-in-feedback`). Use kebab-case and the commit convention prefix.
2. Create and switch to that branch:
   ```bash
   git checkout -b <branch-name>
   ```
3. Stage all relevant files (avoid committing `.claude/`, `.mcp.json`, `.env`, or other tooling/secret files):
   ```bash
   git add <relevant files>
   ```
4. Generate a commit message following the repo convention (e.g. `feat(scope): description`) and commit:
   ```bash
   git commit -m "<commit message>"
   ```

If already on a feature branch with unpushed commits, skip to step 3.

### 3. Determine PR metadata

From the gathered context:

- **`owner`**: `macielrsf`
- **`repo`**: `digital-nomad-app`
- **`head`**: the current branch name (from step 1)
- **`base`**: `master`
- **`title`**: a concise title (≤70 chars) that summarizes the intent of the changes. Follow the commit convention already used in this repo (e.g. `feat(scope): description`, `fix(scope): description`, `refactor(scope): description`).
- **`body`**: a structured description (see format below)

### 3. Generate the PR body

Use this format:

```
## Summary

<2-4 bullet points describing what changed and why>

## Changes

<bullet list of the most important files/modules changed and what was done>

## Test plan

- [ ] <specific thing to verify>
- [ ] <specific thing to verify>

---
🤖 Generated with [Claude Code](https://claude.ai/claude-code)
```

Rules for the body:
- Focus on **why**, not just what
- Mention affected layers (domain / infra / ui) when relevant — this project uses Clean Architecture
- Keep it factual and concise; no filler phrases

### 4. Open the PR

Call the GitHub MCP tool `create_pull_request` with the computed metadata:

```json
{
  "owner": "macielrsf",
  "repo": "digital-nomad-app",
  "title": "<generated title>",
  "body": "<generated body>",
  "head": "<current branch>",
  "base": "master"
}
```

If the MCP tool returns an error because the branch hasn't been pushed yet, push it first:

```bash
git push -u origin <current branch>
```

Then retry `create_pull_request`.

### 5. Report back

Print the PR URL returned by the MCP tool so the user can open it directly.
