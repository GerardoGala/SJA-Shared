document.addEventListener("DOMContentLoaded", () => {

  // 1. Calculate the SJA-Shared directory
  const currentPath = window.location.pathname;
  const projectRoot = currentPath.substring(
    0,
    currentPath.lastIndexOf("/") + 1
  );
  const baseUrl = `${window.location.origin}${projectRoot}`;

  // 2. Safe Component Loader Function
  async function loadComponent(fileName, placeholderId) {
    const placeholder = document.getElementById(placeholderId);

    if (!placeholder) {
      console.error(
        `[Tutorial Layout Error] Could not find an HTML element with id="${placeholderId}".`
      );
      return;
    }

    try {
      const response = await fetch(`${baseUrl}${fileName}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - File not found`);
      }

      const htmlContent = await response.text();

      // Inject the HTML component
      placeholder.innerHTML = htmlContent;

      // Reactivate any script tags found inside the injected HTML component
      placeholder.querySelectorAll("script").forEach((oldScript) => {
        const newScript = document.createElement("script");

        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });

        newScript.appendChild(
          document.createTextNode(oldScript.innerHTML)
        );

        oldScript.parentNode.replaceChild(newScript, oldScript);
      });

    } catch (error) {
      console.error(`Error loading ${fileName}:`, error);
      placeholder.innerHTML =
        `<p style="color: red; padding: 10px;">
          Error loading component (${fileName}).
        </p>`;
    }
  }

  // 3. Load the shared CSS
  const sharedStylesheet = document.createElement("link");
  sharedStylesheet.rel = "stylesheet";
  sharedStylesheet.href = `${baseUrl}shared.css`;

  sharedStylesheet.onerror = () => {
    console.error(
      `[Tutorial Layout Error] Could not load shared.css`
    );
  };

  document.head.appendChild(sharedStylesheet);

  // 4. Load the shared tutorial components
  loadComponent("header.html", "header-placeholder");
  loadComponent("tutorial_footer.html", "footer-placeholder");
});

