document.onselectstart=function(){return false};
var autoplay=false;
var autotimer=null;
var advance=document.getElementById("advance");
var SPEED=100;
function increment(){if(PAGE<340){PAGE+=1;filter(PAGE)}else{cancelAutoPlay()}}
function cancelAutoPlay(){
    clearInterval(autotimer);
    autoplay=false;
    advance.className="button"}
    
advance.onclick=function(){if(!autoplay){advance.className="button enabled";
    autoplay=true;
    if(PAGE==340){PAGE=1}autotimer=setInterval(increment,SPEED)}else{cancelAutoPlay()}};
var oy=-1;var ox=-1;var pagecontrol=document.getElementById("page");
var pageback=document.getElementById("page_back");
var pagedisplay=document.getElementById("page_value");
var hint=document.getElementById("hint");
document.onselectstart=pagecontrol.onselectstart=pageback.onselectstart=function(){return false};
pagecontrol.ontouchmove=function(b){
    if(b.touches.length==1){
        if(ox==-1){
            if(hint){
                hint.style.display="none";
                hint=null
            }
            ox=b.touches[0].pageX
        }else{
            var a=b.touches[0].pageX;
            var c=-(ox-a)*2;
            ox=a;
            if(PAGE+c>0&&PAGE+c<341){
                PAGE+=c;PAGE=PAGE-(PAGE%2);
                filter(PAGE)
            }
        }
        b.preventDefault()
    }
};
pagecontrol.ontouchend=function(a){ox=-1};
pagecontrol.onmousedown=function(a){
    cancelAutoPlay();
    ox=a.pageX;
    document.onmousemove=function(c){
        if(hint){
            hint.style.display="none";
            hint=null
        }
        var b=c.pageX;
        var d=-(ox-b)*2;
        ox=b;
        if(PAGE+d>0&&PAGE+d<341){
            PAGE+=d;
            PAGE=PAGE-(PAGE%2);
            filter(PAGE)
        }
        if(window.getSelection){
            window.getSelection().removeAllRanges()
        }
        c.preventDefault()
    };
    document.onmouseup=function(){
        ox=-1;
        document.onmousemove=null;
        document.onmouseup=null
    }
};
var w=700,h=700,LARGE_CIRCLE=10,SMALL_CIRCLE=5,GRAVITY=0.15,CHARGE=-350,STROKE_WIDTH=4;
var PAGE=340;
var blue="#aec7e8",pink="#f7b6d2";
var vis=d3.select("#chart").append("svg:svg").attr("width",w).attr("height",h);
var force;
var orig_nodes;
var orig_links;
var link;
var node;
var node_count;

function filter(a){
    pageback.style.width=((PAGE/340)*100)+"%";
    pagedisplay.innerHTML=PAGE;
    var d=orig_nodes.filter(function(e){
        return e.page<a
    }
    );
    if(d.length==node_count){
        return
    }
    node_count=d.length;
    force.stop();
    nodes=d;
    links=orig_links.filter(function(e){
        return(e.source.page<a&&e.target.page<a)
    });
    link=vis.selectAll("line.link").data(links,function(e){
        return e.source.name+"-"+e.target.name
    });
    var c=link.enter().append("svg:line").attr("class","link").style("stroke-width",STROKE_WIDTH).attr("x1",function(e){return e.source.x}).attr("y1",function(e){return e.source.y}).attr("x2",function(e){return e.target.x}).attr("y2",function(e){return e.target.y});
    c.append("svg:title").text(function(e){return e.rel});link.exit().remove();
    node=vis.selectAll("g.node").data(nodes,function(e){return e.name});
    var b=node.enter().append("svg:g").attr("class","node").attr("transform",function(e){return"translate("+e.x+","+e.y+")"}).call(force.drag);
    b.append("svg:circle").attr("r",function(e){if(e.major==1){return LARGE_CIRCLE}return SMALL_CIRCLE}).style("fill",function(e){if(e.gender=="m"){return blue}return pink});
    b.append("svg:text").attr("dx",8).attr("dy",".35em").attr("class","nodetext").text(function(e){return e.name});
    node.exit().remove();
    fixOrdering();
    link=vis.selectAll("line.link");
    node=vis.selectAll("g.node");
    force.nodes(nodes).links(links).start()}var svg;
    function fixOrdering(){
        if(!svg){
            svg=document.getElementsByTagName("svg")[0]
        }
        var a=document.getElementsByTagName("line");
        var c=svg.childNodes[0];
        for(var b=0;b<a.length;b++){
            svg.insertBefore(a[b],c)
        }
    }d3.json("egan.json",function(a){
        force=d3.layout.force().charge(CHARGE).gravity(GRAVITY).linkDistance(function(b){return 50}).nodes(a.nodes).links(a.links).size([w,h]).start();
        orig_nodes=force.nodes();
        orig_links=force.links();
        link=vis.selectAll("line.link").data(a.links).enter().append("svg:line").attr("class","link").style("stroke-width",STROKE_WIDTH).attr("x1",function(b){return b.source.x}).attr("y1",function(b){return b.source.y}).attr("x2",function(b){return b.target.x}).attr("y2",function(b){return b.target.y});
        link.append("svg:title").text(function(b){return b.rel});
        node=vis.selectAll("g.node").data(a.nodes).enter().append("svg:g").attr("class","node").attr("transform",function(b){return"translate("+b.x+","+b.y+")"}).call(force.drag);
        node_count=node.length;
        node.append("svg:circle").attr("r",function(b){if(b.major==1){return LARGE_CIRCLE}return SMALL_CIRCLE}).style("fill",function(b){if(b.gender=="m"){return blue}return pink});
        node.append("svg:text").attr("dx",8).attr("dy",".35em").attr("class","nodetext").text(function(b){return b.name});
        vis.style("opacity",0.000001).transition().duration(1000).style("opacity",1);
        force.on("tick",function(){link.attr("x1",function(b){return b.source.x}).attr("y1",function(b){return b.source.y}).attr("x2",function(b){return b.target.x}).attr("y2",function(b){return b.target.y});
        node.attr("transform",function(b){return"translate("+b.x+","+b.y+")"
    })
})
});