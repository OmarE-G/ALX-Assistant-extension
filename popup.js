  
    var cmd = "";
    document.addEventListener('DOMContentLoaded', () => {
        // Request data from background script
        chrome.runtime.sendMessage({ action: 'getGlobalData' }, (response) => {
            if (response && response.globalData) {
                // Data received, update popup content
                document.getElementById("directoryStructure").innerHTML = "";
                displayDirectories(response.globalData, document.getElementById("directoryStructure"));
                cmd = generateLinuxCommand(response.globalData).slice(0, -3)
    
                // Add event listener for the "Copy" button
                const copyButton = document.getElementById("button");
                copyButton.addEventListener('click', () => {
                    // Logic to copy the Linux command to clipboard
                  
                    const tempTextarea = document.createElement('textarea');
                    tempTextarea.value = cmd;
                    document.body.appendChild(tempTextarea);
                    tempTextarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempTextarea);
                    alert('Command copied to clipboard!');

                });
    
            }
        });
    });
    
    // Function to display the directory structure recursively
    function displayDirectories(directories, parentElement) {
        directories.forEach((directory) => {
            // Create a div element for the directory
            const directoryDiv = document.createElement("div");
            directoryDiv.classList.add("directory");
            // Create a span element for the directory name
            const directoryNameSpan = document.createElement("span");
            directoryNameSpan.textContent = directory.name;
            directoryDiv.appendChild(directoryNameSpan);
            // Add files if present
            if (directory.files.length > 0) {
                const filesList = document.createElement("ul");
                directory.files.forEach((file) => {
                    const fileItem = document.createElement("li");
                    fileItem.textContent = file;
                    filesList.appendChild(fileItem);
                });
                directoryDiv.appendChild(filesList);
            }
            // Recursively display subdirectories
            if (directory.subdirs.length > 0) {
                const subdirsDiv = document.createElement("div");
                subdirsDiv.classList.add("subdirectories");
                displayDirectories(directory.subdirs, subdirsDiv);
                directoryDiv.appendChild(subdirsDiv);
            }
            // Append the directory div to the parent element
            parentElement.appendChild(directoryDiv);
        });
    }


    // Function to generate the Linux command recursively
    function generateLinuxCommand(directories, parentDir = "") {
        let command = "";
        directories.forEach((directory) => {
            const currentDir = `${parentDir}${directory.name}`;
            command += `mkdir ${currentDir} && `;
            command += `touch ${currentDir}/README.md && `  
            // Add files if present
            directory.files.forEach((file) => {
                command += `touch ${currentDir}/${file} && `;
            });
            // Recursively generate subdirectories
            if (directory.subdirs.length > 0) {
                command += generateLinuxCommand(directory.subdirs, `${currentDir}/`);
            }
        });
        
        return command;
    }
