// Check if the current URL has the desired prefix
if (window.location.href.startsWith("https://intranet.alxswe.com/projects/")) {
    // Find all <li> elements
    const listItems = document.querySelectorAll('li');
    // Initialize an array to store directory objects
    const directories = [];

    // Initialize variables to keep track of the current directory
    let currentDirectory = null;

    // Iterate over all <li> elements
    listItems.forEach((li) => {
        const text = li.textContent.trim();
        if (text.startsWith("Directory:")) {
            // Extract directory name
            const directoryName = text.split(":")[1].trim();
            // Check if directory already exists
            currentDirectory = directories.find(dir => dir.name === directoryName);
            if (!currentDirectory) {
                // Create a new directory object
                currentDirectory = { name: directoryName, files: [], subdirs: [] };
                directories.push(currentDirectory);
            }
        } else if (text.startsWith("File:") && currentDirectory) {
            // Extract file names
            const fileNames = text.split(":")[1].trim().split(/[\s,]+/);
            // Add file names to the current directory or its subdirectories
            fileNames.forEach((fileName) => {
                handle_file(fileName, currentDirectory)
                const parts = fileName.split('/');
      
            });
        }
    });

    // Send the extracted directory structure to the background script
    chrome.runtime.sendMessage({ directories });
}

function handle_file(fileName, currD){

    const parts = fileName.split('/');
    while(parts.length > 1){
        currD = addsubdir(currD, parts[0])
        parts.shift()
    }
    // If no subdirectory, add the file name to the current directory
    if(!currD.files.includes(parts[0]) && parts[0] != "")
        currD.files.push(parts[0]);

}


function addsubdir(currD, subdirName){

    let subdir = currD.subdirs.find(subdir => subdir.name === subdirName);
    if (!subdir) {
        // If subdirectory does not exist, create it
        subdir = { name: subdirName, files: [], subdirs: [] };
        currD.subdirs.push(subdir);                           
    }
    return subdir;
}