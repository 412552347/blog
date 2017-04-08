$().extend("serialize",function(tags){
	for(var i=0;i<this.elements.length;i++){
		var form=this.elements[i]

			var parts={};
			
			for(var i=0;i< form.elements.length ;i++){

				var file=form.elements[i];
				switch(file.type){
					case 'submit':
					case 'reset':
					case 'file':
					case 'button':
						break;
					case 'radio':
					case 'checkbox':
						if(!file.checked) break;
					case 'select-one':
					case 'select-multiple':

						for(var j=0;j<file.options.length;j++){
							var option=file.options[j];
							if(option.selected){
								var optValue="";
								if (option.hasAttribute) {
									optValue = (option.hasAttribute('value') ? option.value : option.text);
								} else {
									optValue = (option.attributes('value').specified ? option.value : option.text);
								}
								parts[file.name] = optValue; 
							}
						}
						break;
					default:
						parts[file.name]=file.value;
				}
			}

			return parts;
	}
	return this;
})