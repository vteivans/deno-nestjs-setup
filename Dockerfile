FROM denoland/deno:2.1.4

RUN apt-get update -y && apt-get install -y openssl

# The port that my app listens to
EXPOSE 3000

WORKDIR /app

RUN chown -R deno:deno /app
RUN mkdir -p db && chown -R deno:deno db
RUN ls -la

USER deno

# These steps will be re-run on each file change in your working directory:
COPY --chown=deno:deno . .

# Compile the main app so that it doesn't need to be compiled each startup/entry
# - [x] Does this install all the dependencies? Where? - YES
# - [x] Can I run the dependency installation separately? - This is already the installation
# https://docs.deno.com/runtime/reference/migration_guide/
# RUN deno cache main.ts
# With the Deno 2 release `deno cache` command is merged in to `deno install` command
RUN deno install
# Separate this step to see what is the consequence of running the scripts
RUN deno install --allow-scripts=npm:prisma,npm:@prisma/client,npm:@prisma/engines,npm:@nestjs/core || [$? -eq 0] || exit 1

RUN deno task prisma:generate
RUN deno task prisma:db:push || echo "$? Push error"

# Warm up caches
# - What does this do exactly?
# `timeout 10s deno -A main.ts`: This part runs the deno command with the -A flag (which grants all permissions) to execute the main.ts script. The timeout 10s command limits the execution time to 10 seconds. If the command takes longer than 10 seconds, it will be terminated.
# `|| [ $? -eq 124 ]`: This part checks the exit status of the previous command. The || operator means "or". If the deno command is terminated by the timeout command, it will exit with status code 124. The [ $? -eq 124 ] checks if the exit status ($?) is equal to 124.
# `|| exit 1`: If the exit status is not 124, this part will execute exit 1, which causes the Docker build to fail with exit code 1.
RUN timeout 10s deno task start || [ $? -eq 124 ] || exit 1

CMD ["deno", "task", "start"]