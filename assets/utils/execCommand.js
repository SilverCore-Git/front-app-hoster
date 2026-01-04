const { exec } = require("child_process");

function execCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
        const proc = exec(command, { ...options, maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
        if (err) return reject(err);
            resolve(stdout);
        });

        proc.stdout.pipe(process.stdout);
        proc.stderr.pipe(process.stderr);
    });
}

module.exports = execCommand;