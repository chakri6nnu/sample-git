const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");

const repoPath = "./laravel-time-tracker"; // Replace with the actual path to your sample-git repository
const destinationFolderPath = "./test2"; // Replace with the destination folder path

const git = simpleGit(repoPath);

// Get the list of all commits in the repository
git.log((err, log) => {
  if (err) {
    console.error(err.message);
    return;
  }

  // Iterate through each commit
  log.all.forEach((commit) => {
    const commitHash = commit.hash;

    // Get the list of files changed in the specified commit
    git.show(["--name-only", commitHash], (showErr, result) => {
      if (showErr) {
        console.error(showErr.message);
        return;
      }

      // Split the result into an array of file paths
      const files = result.split("\n").filter(Boolean);

      // Copy each file to the destination folder
      files.forEach((filePath) => {
        git.show([`${commitHash}:${filePath}`], (contentErr, content) => {
          if (contentErr) {
            console.error(contentErr.message);
            return;
          }

          const destinationPath = path.join(destinationFolderPath, filePath);

          // Ensure the destination folder exists
          fs.mkdirSync(path.dirname(destinationPath), { recursive: true });

          // Write the content to the new destination
          fs.writeFileSync(destinationPath, content);
          console.log(
            `Commit ${commitHash}: File copied to: ${destinationPath}`
          );
        });
      });
    });
  });
});
