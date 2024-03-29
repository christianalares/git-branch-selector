# Git Branch Selector - Changelog

### **1.3.2:**

- Feature: Add support for passing an optional search term e.g. `ggb devel`. This might match your list of branches containing the term "devel". If the number of search hits is one, it will change to that branch instantly. If the results are more than one, it will show a filtered list of those matches.

### **1.3.1:**

- Hotfix: Fix crash when selecting a branch

---
### **1.3.0:**

- Feature: Add possibility to fuzzy search branches

---
### **1.2.0:**

- Feature: Increase the list to 20 items to prevent scrolling in the list of branches
- Refactor: Use ES Modules instead of Common JS imports
- Other: Upgrade packages

---

### **1.1.5:**

- Bugfix: Choice is now keeping its value instead of the value beeing overwritten with the title
- Feature: Add indicies to the list
- Feature: Pressing the button `q` exits the process (along with `escape` and `ctrl+c`)

---

### **1.0.0:**

- Initial release
