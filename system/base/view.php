<?php
class View
{
    function render($content_view, $template_view, $data = null)
    {   
        include 'system/views/'.$template_view;
    }
}
?>