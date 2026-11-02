**Technical Note: Vite Environment Variables & Precedence Rules**

**Vite loads** `**.env**` **files sequentially by matching the active mode, merging their keys so that later files override earlier ones, while system-level environment variables (like those from** `**env-cmd**`**) override all files.**

* * *

**1\. Vite Environment File Precedence**

Vite evaluates `.env` files in a specific order. The file read later wins conflicts for matching keys.

**The Loading Chain (Weakest to Strongest)**

1.  `.env` *(Always loaded, the base layer)*
2.  `.env.local` *(Always loaded if present)*
3.  `.env.[mode]` *(Loaded only for the active mode, e.g.,* `*.env.development*`*)*
4.  `.env.[mode].local` *(Loaded only for the active mode, e.g.,* `*.env.development.local*`*)*
5.  **Environment Variables** *(Set before Vite starts via shell or* `*env-cmd*`*; beats all files)*

**How Modes Map to Files**

The file name must match the `--mode` flag exactly string-for-string.

-   `--mode development` → Looks for `.env.development` & `.env.development.local`
-   `--mode qa` → Looks for `.env.qa` & `.env.qa.local`
-   `--mode uat` → Looks for `.env.uat` & `.env.uat.local`
-   `--mode production` → Looks for `.env.production` & `.env.production.local`

> ⚠️ **Naming Trap:** `--mode dev` will look for `.env.dev`. It will completely ignore `.env.development`.
>
> ⚠️ **Non-standard Files:** Client files like `.colpal.env.uat` or `.jfl.env.prod` do not follow Vite's `.env.[mode]` naming convention. Vite will never load them automatically; they only work when explicitly passed via an external tool like `env-cmd -f`.

* * *

**2\. Default Command Behaviours**

Each default Vite command triggers a specific fallback mode if the `--mode` flag is omitted.

| **Command** | **Default Mode** | **Automatically Loads** `**.env.development.local**`**?** |
| --- | --- | --- |
| `vite` (`npm run dev`) | `development` | ✅ **Yes** (No flags needed) |
| `vite build` | `production` | ❌ **No** (Unless `--mode development` is added) |
| `vite build --mode development` | `development` | ✅ **Yes** *(Used by DPAI & SNOP* `*npm run build*`*)* |
| `vite preview` | `production` | ❌ **No** (Unless `--mode development` is added) |
| `vitest` | `test` | ❌ **No** (Defaults strictly to `.env.test`) |

* * *

**3\. Case Studies & Override RulesCase A: Running with** `**--mode qa**`

When running `vite build --mode qa`, Vite skips all `development` files and stacks the active configurations as follows:

1.  `.env` (Base layer - read first, weakest)
2.  `.env.local` (Always loaded if it exists)
3.  `.env.qa` (Matches the active mode - overrides `.env`)
4.  `.env.qa.local` (Matches the active mode - read last, strongest file layer)

*Keys that only exist in* `*.env*` *still apply, but* `*.env.qa*` *values will beat* `*.env*` *values for the same key.*

**Case B: Using** `**env-cmd -f .env.qa**` **during a Production Build**

If you execute a standard `vite build` (which defaults to `production`) wrapped in an `env-cmd` targeted at a QA file, the resolution behaves as follows:

| **File Profile** | **Loaded?** | **Loaded By** | **Resolution Context** |
| --- | --- | --- | --- |
| `**.env.qa**` | ✅ Yes | `env-cmd` | **Wins entirely.** Injected as environment variables, defeating all Vite files. |
| `**.env**` | ✅ Yes | Vite | Loaded as the fallback base layer. |
| `**.env.local**` | ✅ Yes | Vite | Loaded if it physically exists. |
| `**.env.production**` / `**.local**` | ✅ Yes | Vite | Loaded because Vite's active mode evaluates to `production`. |
| `**.env.qa.local**` | ❌ No | Nobody | Ignored because the active mode is not `qa`. |
| `**.env.development.local**` | ❌ No | Nobody | Ignored because the active mode is not `development`. |

* * *

**4\. Why** `**env-cmd -f .env**` **Breaks Local Overrides**

Swapping local scripts changes how variables resolve, impacting API targets.

**Scenario 1: Native Vite (**`**vite --port 3000**`**)**

-   **Evaluation Order:** `.env` (weakest) → `.env.local` → `.env.development` → `.env.development.local` (strongest)
-   **Visual Override Flow:**

text

Markdown

```markdown
.env                  -> VITE_SNOP_API_ENDPOINT=https://3sc.ai.env.development.local -> VITE_SNOP_API_ENDPOINT=/api  <-- WINS
```

Use code with caution.

-   **Result:** `.env.development.local` wins. The API endpoint resolves to the local proxy route `/api`. ✅

**Scenario 2: Wrapped Env (**`**env-cmd -f .env vite --port 3000**`**)**

-   **Evaluation Order:** System Environment Variables (from `.env` via `env-cmd`) → Vite Files (`.env` up to `.env.development.local`)
-   **Visual Override Flow:**

text

Markdown

```markdown
env-cmd (System level) -> VITE_SNOP_API_ENDPOINT=https://3sc.ai <-- WINS OVER ALL FILES.env.development.local -> VITE_SNOP_API_ENDPOINT=/api  <-- IGNORED
```

Use code with caution.

-   **Result:** Because `env-cmd` injects `.env` directly into the process environment, those variables bypass the file cascade entirely. The production/UAT address [https://3sc.ai](https://3sc.ai/ "https://3sc.ai/") inside `.env` will override your local `/api` value. ❌


** -----------------------------------------------------------------------------------------

Here is a punchy, copy-pasteable cheatsheet summarizing everything we discussed about hashing, salting, and Bcrypt.

🔐 Password Security & Bcrypt Cheatsheet


1. Hashing Basics

• One-Way Only: Hashing transforms text into a fixed-length string. It is mathematically impossible to reverse or "decrypt".
• The Flaw: Identical inputs always produce identical hashes. Hackers use pre-computed cheat sheets (Rainbow Tables) to instantly match stolen hashes back to common passwords.

2. Salting (Adding Randomness)

• What it is: A unique, random string added to the password before it is hashed (password + salt).
• The Purpose: It differentiates hashes. If two users have the same password, their unique salts ensure their final database hashes look completely different.
• Storage: The salt is not a secret. It is stored in plain text right next to the username so the server can fetch it during login.
• The Defense: It destroys Rainbow Tables. Hackers must build a slow, custom dictionary attack for every single user individually.

3. Bcrypt (The Industry Standard)

• The Slowdown (Key Stretching): Unlike fast hashing tools, Bcrypt is intentionally slow. It runs a hidden loop to hash the data over and over, wasting the hacker's computer power.
• Salt Rounds: The number of rounds is an exponent (\(2^{\text{rounds}}\)).
 • 10 rounds = 1,024 loops
 • 12 rounds = 4,096 loops
 • Adding +1 to the rounds doubles the time it takes.
• Single-Column Storage: Bcrypt packages the version, salt rounds, salt string, and final hash into one single string:
\(\underbrace{\mathbf{\$2b\$}}_{\text{Version}}\ \underbrace{\mathbf{\$12\$}}_{\text{Rounds}}\ \underbrace{\mathbf{\$R9h/cSU\dots }}_{\text{Salt}}\underbrace{\mathbf{JExJL5\dots }}_{\text{Hash}}\)

4. Code Execution Summary

• hashSync(password, 12) [Sign-up]: Detects the second argument is a number. Automatically runs genSaltSync(12) to make a text salt, loops \(2^{12}\) times, and returns the combined string bundle to save in the database.
• compareSync(password, storedHash) [Login]: Automatically extracts the rounds and the salt string directly out of the storedHash. It re-hashes the typed password using those exact parameters to see if the final strings match.

//   ------------------------------------ 
const bcrypt = require('bcrypt');

// =============================================================
// STEP 1: USER SIGN-UP (Automatic Salting & Hashing)
// =============================================================
const userPassword = "monkey123";
const saltRounds = 12; // 2^12 = 4,096 internal hashing loops

// Passes a NUMBER -> Automatically generates salt string & hashes password
const storedHashFromDatabase = bcrypt.hashSync(userPassword, saltRounds);

console.log("Save this single string to your 'password' column:");
console.log(storedHashFromDatabase);
// Example Output: $2b$12$R9h/cSUJExJL5apvxqgQOORx14mOEX0jQnO57f897f23...


// =============================================================
// STEP 2: USER LOGS IN (Automatic Extraction & Comparing)
// =============================================================
const typedPasswordCorrect = "monkey123";
const typedPasswordWrong   = "wrongpassword";

// Bcrypt reads '$12$' and the salt right out of the 2nd argument string,
// hashes the 1st argument with those settings, and checks if they match.
const isMatch1 = bcrypt.compareSync(typedPasswordCorrect, storedHashFromDatabase);
const isMatch2 = bcrypt.compareSync(typedPasswordWrong, storedHashFromDatabase);

console.log(`Did correct password match? -> ${isMatch1}`); // Returns true
console.log(`Did wrong password match?   -> ${isMatch2}`); // Returns false


// =============================================================
// BONUS: WHAT IS HAPPENING UNDER THE HOOD? (Manual Equivalent)
// =============================================================
// This achieves the EXACT same result as Step 1, but exposes the hidden step:
const manualSalt = bcrypt.genSaltSync(12);                 // Gen salt string: $2b$12$R9h...
const manualHash = bcrypt.hashSync(userPassword, manualSalt); // Passes a STRING -> Uses it directly
 
