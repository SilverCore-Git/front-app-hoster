const { exec } = require("child_process");

function execCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
        exec(command, { 
            ...options, 
            maxBuffer: 1024 * 1024 * 10
        }, (err, stdout, stderr) => {
            if (err) {
                err.stdout = stdout;
                err.stderr = stderr;
                return reject(err);
            }
            resolve(stdout);
        });
    });
}

module.exports = execCommand;