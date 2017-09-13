WbmQueryManager - Database-Management plugin for Shopware
=====
[![Scrutinizer](https://scrutinizer-ci.com/g/webmatch/WbmQueryManager/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/webmatch/WbmQueryManager/?branch=master)
[![Travis CI](https://travis-ci.org/webmatch/WbmQueryManager.svg?branch=master)](https://travis-ci.org/webmatch/WbmQueryManager)

This plugin integrates a new module within the [Shopware](https://www.shopware.de) backend that allows for a simple management of SQL queries and their manual or automated execution.

![WbmQueryManager](https://www.webmatch.de/wp-content/uploads/2017/02/query_manager_screen.png)

The plugin offers the following features:

* Write, edit, delete, duplicate and run queries
* Shows fetched rows within backend immediately
* Download fetched rows as CSV format
* Execute queries in regular intervals as cron-jobs
* Cron-Jobs: Logging of fetched rows in CSV format
* Cron-Jobs: Send emails with attached log-files
* SQL syntax highlighting (Codemirror)
* Syntax and table structure autocompletion (Codemirror)

Requirements
-----
* Shopware >= 5.2.0

**Optional:**

* MySQL Improved Extension (MySQLi)
  * enables the fetching of more than one rowsets per query by multiple statements (*multi_query*)

Installation
====
Clone this repository into a folder **WbmQueryManager** within the **custom/plugins** directory of the Shopware installation.

Install the plugin through the Plugin-Manager within the Shopware backend. Activate the plugin and when prompted allow for the clearing of the listed caches.
Reload the backend to complete the installation.


## Install with composer
* Change to your root Installation of shopware
* Run command `composer require webmatch/wbm-query-manager` and install and activate plugin with Plugin Manager 

Usage
=====
The module will be accessible in backend through a new menu point under the Settings menu tab.

The plugin comes with a few example queries which can be safely deleted.

Configuration
=====
The plugin offers a few basic configuration options:

* *Send CSV Exports to an E-Mail Address*
  * (see **Cron-Jobs** below)
* *CSV Field Separator*
  * (see **Cron-Jobs** below)
* *Active SQL Autocompletion*
  * if the autocompletion of syntax isn't desired it can be disabled

Cron-Jobs
=====

To use the cron-job features of this plugin please first make sure the plugin **Cron** is installed in Plugin Manager and the Cron-Job **Query Manager** is activated in the cron job settings.

Shopware Cron-Jobs can be executed via request of the URL (e.g. http://your-shop.tld/backend/cron) or by console command **php bin/console sw:cron:run** (recommended)

Your server has to be setup accordingly to either request the cron URL or run the console command in regular intervals. This interval naturally also determines the minimum 
interval that Shopware cron-jobs can be executed at.

Fetched rows of SELECT statements executed through cron-jobs will be logged as CSV files in the directory **var/logs** of the Shopware installation.
By specifying an email address in the plugin configuration logged files will also be transmitted by email.

