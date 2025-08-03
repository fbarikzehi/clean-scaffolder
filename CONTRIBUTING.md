# 🤝 Contributing to Zero-Config Scaffolding Toolkit

First off, thanks for taking the time to contribute! 💙
This project thrives on community input and collaboration.

We welcome **everyone** to help improve or expand this toolkit — whether you're fixing typos, optimizing scripts, or adding support for new languages, frameworks, and tools.

---

## 🚀 How to Contribute

### 1. Clone & Setup

```bash
git clone https://github.com/fbarikzehi/clean-scaffolders.git
cd clean-scaffolders
```

### 2. Add Your Script

Each scaffold script should follow these principles:

* **Zero-config**: It should require no manual configuration after execution.
* **Clean architecture**: Follow clean and best practices for folder structure and code organization.
* **Pre-installed essentials**: Include useful defaults (e.g., linting, testing, versioning).
* **Documented**: Add a short description inside the script (as comments).

Name your script using this format:

```
create-clean-<tech-name>.sh   or   create-clean-<tech-name>.js
```

Examples:

* `create-clean-react.js`
* `create-clean-go.sh`
* `create-clean-nest.sh`
* `create-clean-next.sh`

### 3. Test Your Script

Before submitting your pull request:

* Run the script locally and test the generated project
* Ensure the directory structure, tooling, and dependencies work correctly
* Include comments or inline prompts if needed for clarity

### 4. Update Documentation

If you add a new script:

* Add it to the `README.md` list of available scripts in the **📦 What’s Inside?** section
* Optionally include a short breakdown of its features

---

## ✅ Contribution Tips

* Keep shell scripts POSIX-compliant (`#!/bin/bash`)
* For Node-based scripts, prefer ESModules (`.mjs`) or CommonJS (`.js`) depending on compatibility
* Follow existing naming/style patterns for consistency
* Keep scripts and folder structures clean and minimal

---

## 🛠️ Issues & Feature Requests

Have an idea for improvement or something isn’t working right?
[Open an issue](https://github.com/fbarikzehi/clean-scaffolders/issues) and we’ll look into it.

---

## 💬 Join the Conversation

If you have questions or want to collaborate more deeply, open a discussion or reach out via issues.

---

## 📄 License

All contributions are under the [MIT License](LICENSE).
By contributing, you agree that your work will be licensed accordingly.

---

Thanks again for being part of this project! 🌟
