// Main Application Controller
class NavidromeWrappedApp {
  constructor() {
    this.currentView = "login";
    this.stats = null;
    this.activeClient = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Login form submission
    document
      .getElementById("generateBtn")
      .addEventListener("click", () => this.generateWrapped());
    document.getElementById("cancelBtn").addEventListener("click", () => this.cancelGeneration());
    // Navigation between views
    document
      .getElementById("viewWrappedBtn")
      .addEventListener("click", () => this.showWrapped());
    document
      .getElementById("retryBtn")
      .addEventListener("click", () => this.showLogin());
  }

  validateInputs(serverUrl, username, password) {
    if (!serverUrl || !username || !password) {
      this.showError(
        "Missing Information",
        "Please fill in all server details."
      );
      return false;
    }

    let url;
    try {
      url = new URL(serverUrl);
    } catch {
      this.showError("Invalid URL", "Enter a valid HTTPS Navidrome server URL.");
      return false;
    }
    if (url.protocol !== "https:" || !url.hostname) {
      this.showError("HTTPS required", "For your security, wrapped45 only connects to HTTPS Navidrome servers.");
      return false;
    }
    if (url.username || url.password || url.search || url.hash) {
      this.showError("Invalid URL", "Enter the server address without credentials, query parameters or a fragment.");
      return false;
    }
    return true;
  }

  cancelGeneration() {
    this.activeClient?.cancel();
  }

  setLoadingState(loading) {
    const generateBtn = document.getElementById("generateBtn");
    const btnText = generateBtn.querySelector(".btn-text");
    const btnLoading = generateBtn.querySelector(".btn-loading");

    document.getElementById("cancelBtn").hidden = !loading;
    generateBtn.disabled = loading;
    btnText.style.display = loading ? "none" : "inline";
    btnLoading.style.display = loading ? "block" : "none";
  }

  updateProgress(percent, message, details) {
    const percentInt = Math.max(0, Math.min(100, parseInt(percent, 10) || 0));
    document.getElementById("progressFill").style.width = `${percentInt}%`;
    document.getElementById("progressPercent").textContent = `${percentInt}%`;
    document.getElementById("progressMessage").textContent = window.WrappedI18n?.t(message) ?? message;
    document.getElementById("progressDetails").textContent = window.WrappedI18n?.t(details || "") ?? (details || "");
  }

  hideSections() {
    document.getElementById("resultsSection").style.display = "none";
    document.getElementById("errorSection").style.display = "none";
  }

  async generateWrapped() {
    const serverUrl = document.getElementById("serverUrl").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!this.validateInputs(serverUrl, username, password)) {
      return;
    }

    this.setLoadingState(true);
    this.hideSections();

    let api;
    try {
      api = new ClientSideND(serverUrl, username, password);
      this.activeClient = api;
      // The password is no longer kept in a form field while scanning.
      document.getElementById("password").value = "";

      // Test connection
      this.updateProgress(5, "Testing connection...", "Pinging server");
      const pong = await api._req("ping");
      if (!pong)
        throw new Error("Cannot reach server. Check your URL and credentials.");
      // Generate stats with progress updates
      this.stats = await api.stats((percent, message, step, details) => {
        this.updateProgress(percent, message, details);
      });

      if (!this.stats.totalSongs)
        throw new Error("No music data found on your server");

      this.showResults();
    } catch (error) {
      this.stats = null;
      this.showError("Generation Failed", error.message);
    } finally {
      if (api) api.clearCredentials();
      this.activeClient = null;
      document.getElementById("password").value = "";
      this.setLoadingState(false);
    }
  }

  showResults() {
    const username = this.stats.username || "Unknown User";
    // Usernames are untrusted server data: render as text, never HTML.
    const quickStats = document.getElementById("quickStats");
    quickStats.replaceChildren();
    const label = document.createElement("p");
    label.append((window.WrappedI18n?.t("Generated for user: ") ?? "Generated for user: "));
    const name = document.createElement("strong");
    name.textContent = username;
    label.appendChild(name);
    quickStats.appendChild(label);

    document.getElementById("resultsSection").style.display = "block";
    window.WrappedI18n?.refresh();
    // The result is kept in memory only until the page is reloaded.
  }

  showWrapped() {
    document.getElementById("loginView").style.display = "none";
    document.getElementById("wrappedView").style.display = "block";
    const data = this.stats;
    if (!data) {
      this.showLogin();
      return;
    }
    new WrappedDisplay(data);
  }

  showLogin() {
    document.getElementById("wrappedView").style.display = "none";
    document.getElementById("loginView").style.display = "block";
    this.stats = null;

    // Reset form
    document.getElementById("serverUrl").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    this.hideSections();
  }

  showError(title, message) {
    document.getElementById("errorTitle").textContent = window.WrappedI18n?.t(title) ?? title;
    document.getElementById("errorMessage").textContent = window.WrappedI18n?.t(message) ?? message;
    document.getElementById("errorSection").style.display = "block";
  }
}

// Initialize app when page loads
document.addEventListener("DOMContentLoaded", () => {
  window.navidromeApp = new NavidromeWrappedApp();
});
