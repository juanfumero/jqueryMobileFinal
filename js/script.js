var App = function() {
	var inicio = '#inicio';
	var presupuestos = '#presupuestos';
	var navbar = '.navbar';
	
	var comp_creacion = 'componentes/creacion.html';
	var comp_presupuestos = 'componentes/presupuestos.html';
	var comp_menu = 'componentes/menu.html';
	
	var checkboxes;
	var refresh = function() {
		$('[data-role="page"]').trigger('create');
	};
	
	var initComponente = function(selector, componente, callback) {
		$(selector).load(componente, callback);
	};
	
	var initNavegacion = function() {
		initComponente(navbar, comp_menu, function() {			
			refresh();
		});
	};
	
	this.refreshNavegacion = function() {
		var pagina = $(':mobile-pagecontainer').pagecontainer( 'getActivePage' ).attr( 'id' );
		
		$('[data-role="navbar"] a').removeClass('ui-btn-active');
		$('a[href="#'+pagina+'"]').addClass('ui-btn-active');
	};
	
	this.init = function() {
		initPrecios();
		initComponente(inicio, comp_creacion, function() {			
			initNavegacion();
			
			$('fieldset#complejidad input').on('click', function() {
				$('small#complejidad-descripción').html($(this).attr('data-descripcion'));
			});

			calcular();
			initControles();
			showRecords();

			
		});
		
		initComponente(presupuestos, comp_presupuestos, function() {
			initNavegacion();
		});
	};

	var initPrecios = function(){
		$.get('http://adevelca.com/obtener-precios', function(data){
			checkboxes = JSON.parse(data);
		});
	};

	var calcular = function() {
		var suma = 0;
		//var precio_pagina = 5500;
		//var precio_tema = 2500;
		//var precio_email = 1500;

		var sliders = {
			paginas: 5500,
			temas: 2500,
			email: 1500
		}

		$.each(sliders,function(i,valor){
			suma += $('input[name=slider-'+ i +']').val()*valor;
		});

		var complejidad = {
			personal: 20000,
			standard: 30000,
			avanzado: 40000,
			deluxe: 50000,
			profesional: 60000,
			empresarial: 70000
		}

		var select_complejidad = $('input[name=check-complejidad]:checked');
		if(select_complejidad.length > 0){
			suma += complejidad[ select_complejidad.val()];
		}

		//suma+= $('input[name=slider-paginas]').val()*precio_pagina;
		//suma+= $('input[name=slider-temas]').val()*precio_tema;
		//suma+= $('input[name=slider-email]').val()*precio_email;

		//var opciones = ['opciones','social','fotos','modulos','monetizacion','servicios' ];
		$.each(checkboxes, function(i,valor){
			$.each($('input[name=check-'+ i +']:checked'), function(j, obj){
				suma += checkboxes[i][ $(obj).val()];

			});
		});


		$('#total').val(suma.toFixed(2));
	};

	var initControles = function(){
		$(document).on('change','input[name=slider-paginas]', function(){
			calcular();
		});

		$(document).on('change','input[name=slider-temas]', function(){
			calcular();
		});

		$(document).on('change','input[name=slider-email]', function(){
			calcular();
		});

		$('input[name=check-complejidad]').on('change', function(){
			calcular();
		});
		$('input[name=check-opciones]').on('change', function(){
			calcular();
		});
		$('input[name=check-social]').on('change', function(){
			calcular();
		});
		$('input[name=check-fotos]').on('change', function(){
			calcular();
		});
		$('input[name=check-modulos]').on('change', function(){
			calcular();
		});
		$('input[name=check-monetizacion]').on('change', function(){
			calcular();
		});
		$('input[name=check-servicios]').on('change', function(){
			calcular();
		});

		$('form').on('submit',function(ev){
			ev.preventDefault();

			/* PARA ENVIAR EL EMAIL descomentar y comentar
			$.post('http://adevelca.com/enviar-correo', {
				nolmbre: $('#presupuesto-guardar').val(),
				email: $('#email-enviar').val(),
				monto: $('#total').val()
			}, function(data){
				$('#mensaje-guardar').show();
			});*/

			$.post('http://adevelca.com/enviar-correo', {
				nolmbre: $('#presupuesto-guardar').val(),
				email: $('#email-enviar').val(),
				monto: $('#total').val()
			}, function(data){
						//$('#mensaje-guardar').show();

						insertRecord(
							$('#presupuesto-guardar').val(),
							$('#email-enviar').val(),
							$('#total').val()
							);
						showRecords();
						$('#mensaje-guardar').show();
						$('#presupuesto-guardar').val('');
						$('#email-enviar').val('');

					});
			
		});
	};

	
};

$(document).on('pagebeforeshow', function() {	
	var app = new App();
	app.init();
});

$(document).on('pagechange', function() {
	var app = new App();
	app.refreshNavegacion();
});