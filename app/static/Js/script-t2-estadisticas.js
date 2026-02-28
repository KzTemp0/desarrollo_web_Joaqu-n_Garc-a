async function draw(){
  const d1 = await (await fetch("/api/stats/por-dia")).json();
  const d2 = await (await fetch("/api/stats/por-tipo")).json();
  const d3 = await (await fetch("/api/stats/por-mes")).json();

  Highcharts.chart('chart-por-dia',{
    title:{text:''},
    xAxis:{categories:d1.map(x=>x.dia)},
    yAxis:{title:{text:'Cantidad'}},
    series:[{type:'line',name:'Avisos',data:d1.map(x=>x.cantidad)}],
    legend:{enabled:false}
  });

  Highcharts.chart('chart-por-tipo',{
    title:{text:''},
    series:[{type:'pie',name:'Avisos',data:d2.map(x=>[x.tipo,x.cantidad])}]
  });

  const cats = d3.map(x=>x.mes);
  Highcharts.chart('chart-por-mes',{
    title:{text:''},
    xAxis:{categories:cats},
    yAxis:{title:{text:'Cantidad'}},
    series:[
      {type:'column',name:'Gatos',data:d3.map(x=>x.gato||0)},
      {type:'column',name:'Perros',data:d3.map(x=>x.perro||0)}
    ]
  });
}
draw();
