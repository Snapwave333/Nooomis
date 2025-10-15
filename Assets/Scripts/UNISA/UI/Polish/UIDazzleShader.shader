Shader "UNISA/UIDazzle" {
  Properties {
    _Color ("Tint", Color) = (1,1,1,1)
    _Blend ("Blend", Range(0,1)) = 0.35
  }
  SubShader {
    Tags { "Queue"="Transparent" "RenderType"="Transparent" }
    Blend SrcAlpha OneMinusSrcAlpha
    Pass {
      CGPROGRAM
      #pragma vertex vert
      #pragma fragment frag
      #include "UnityCG.cginc"
      struct appdata { float4 vertex:POSITION; float2 uv:TEXCOORD0; };
      struct v2f { float4 pos:SV_POSITION; float2 uv:TEXCOORD0; };
      fixed4 _Color; float _Blend;
      v2f vert(appdata v){ v2f o; o.pos=UnityObjectToClipPos(v.vertex); o.uv=v.uv; return o; }
      fixed4 frag(v2f i):SV_Target {
        float t = frac(_Time.y * 0.25 + i.uv.x * 0.5);
        fixed3 glow = lerp(fixed3(0.1,0.2,0.4), fixed3(0.4,0.8,1.0), t);
        fixed4 col = fixed4(glow, _Blend);
        return col * _Color;
      }
      ENDCG
    }
  }
}