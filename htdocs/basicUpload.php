<?php


$Session->requireAuthentication();


?>


<h1>JSON</h1>
<form action="/media/json/upload" method="POST" enctype="multipart/form-data">
	
	<input name="mediaFile" type="file" >
	<input type="submit">

</form>

<h1>Standard</h1>
<form action="/media/upload" method="POST" enctype="multipart/form-data">
	
	<input name="mediaFile" type="file" >
	<input type="submit">

</form>