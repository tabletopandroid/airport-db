#!/usr/bin/env node

import { runCLI } from "../dist/cli.js";

// Pass command-line arguments (skip node path and script path)
runCLI(process.argv.slice(2));
