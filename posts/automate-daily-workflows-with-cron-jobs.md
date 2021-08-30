---
title: "Automate daily workflows with cron jobs"
date: "2021-08-29"
---

#### Ok, first of all, what are cron jobs ?

> Cron jobs are basically time based schedulers that execute certain actions based on the command provided or the steps mentioned in a script.

#### Now why would we need a cron job ?

> Simple, to automate the repetitive tasks. This will save us time and manual effort involved. My mentor often would say, if you are going to do the same action multiple times, as software developers we need automate it and shift our focus on other things at hand.

#### With what and why cleared, lets jump into how !

This how a sample cron job will look like:

```
0 12 * * * shell-script.sh
```

what the above line does is, it runs `shell-script.sh` script file everyday at 12pm.

We can have anything inside the shell script.
for example, i can add a script to automatically pull latest changes from main branch

```
cd ~/Desktop/my-repo
git checkout main
git pull
```

> The most important part is the first 5 characters => 0 12 \* \* \*

This is what defines the rule for a cron job on when to run.

Each character represents a specific time unit.

- first character represents minute
- second character represents hour
- third character represents day of the month
- fourth represents month
- fifth represents day of the week

if you provide `*` for any one character, it means run the script at every occurance of that unit time.

if first character is `*` then it means run the sciprt every minute.
if second character is `*`, then it means run the script every hour. likewise every day, every month, all days in a week

Now coming back to our initial cron job,

```
0 12 * * *

0 - dont run every minute
12- run daily at 12pm
* - run every day of the month
* - run every month
* - run all days in a week
```

We can modify the expression however we like at whatever time we want it to run.
Few examples:

```
* * * * * (run every minute)
0 * * * * (run every hour)
0 0 * * * (run at midnight every day)
0 * * * 1-5 (run every hour monday to friday)
0 * * * SUN (run every hour only on sunday)
*/20 * * * * (run every 20 minutes on all days)
0 9-17 * * * (run every hour between 9am and 5pm on all days)
```

to test out an expression for your usecase, checkout [crontab.guru](https://crontab.guru/hour-range)

#### With the basics set, lets jump into setting up a cron job:

A cron job can be setup in multiple places - [Jenkins](https://www.jenkins.io/), AWS, even in [node.js](https://www.npmjs.com/package/cron). For simplicity, in this article, we will focus on setting up in local machine.

1. Type `crontab -e` in terminal. This will open up an vi editor to add our cron jobs
2. Lets add our cron job:

```
MAILTO="abc@gmail.com"
0 12 * * * ~/Desktop/repos/merge.sh >> ~/Desktop/repos/cron.log 2>&1
```

Lets take a minute to go over whats happening here.

- `MAIL_TO` specifies the mail id to which error report should be sent in case the cron job fails.

In next line,

- the cron expression - `0 12 * * *` (run every day at 12pm)
- path of the script file to run - `~/Desktop/repos/pull.sh`
- path of the log file to dump the logs - `~/Desktop/repos/cron.log`
- `2>&1` is a [shell expression](https://stackoverflow.com/questions/818255/in-the-shell-what-does-21-mean) to merge the output to the log file.

We can have any number of cron jobs.

```
0 12 * * * ~/Desktop/repos/pull.sh
2 12 * * * ~/Desktop/repos/merge.sh
* * * * * ~/Desktop/repos/script3.sh
```

finally, save and close the editor by typing `:wq`

We are done :tada:
Now the scripts will be executed automatically without us having to go and type the commands every day at a specific time like a robot. We can focus on more challenging tasks. :relieved::innocent:
