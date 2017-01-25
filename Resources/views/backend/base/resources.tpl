{block name="backend/base/header/css" append}
    <link rel="stylesheet" type="text/css" href="{link file=$queryManagerPath|cat:'/Resources/views/backend/_resources/css/query-manager.css'}" />
{/block}

{block name="backend/base/header/javascript" append}
    <script type="text/javascript" src="{link file=$queryManagerPath|cat:'/Resources/views/backend/_resources/js/show-hint.js'}"></script>
    <script type="text/javascript" src="{link file=$queryManagerPath|cat:'/Resources/views/backend/_resources/js/sql-hint.js'}"></script>
{/block}