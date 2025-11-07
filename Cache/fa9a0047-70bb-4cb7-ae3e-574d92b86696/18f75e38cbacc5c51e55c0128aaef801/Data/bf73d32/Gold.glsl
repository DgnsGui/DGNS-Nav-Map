#version 310 es

//-----------------------------------------------------------------------
// Copyright (c) 2019 Snap Inc.
//-----------------------------------------------------------------------

// SCC_FRONTEND_SHADER_FLAGS_BEGIN__
// SCC_FRONTEND_SHADER_FLAGS_END__

// SCC_BACKEND_SHADER_FLAGS_BEGIN__
// NGS_FLAG_IS_NORMAL_MAP normalTex
// NGS_FLAG_IS_NORMAL_MAP detailNormalTex
// SCC_BACKEND_SHADER_FLAGS_END__


#if !SC_RT_RECEIVER_MODE
#define SC_FRAG_DATA_COUNT 1
#else
#define SC_FRAG_DATA_COUNT 2
#endif


#define NODEFLEX 0 // Hack for now to know if a shader is running in Studio or on a released lens

//-----------------------------------------------------------------------

#define NF_PRECISION highp

//-----------------------------------------------------------------------

// 10-09-2019 - These defines were moved to PBR node but Some old graphs 
//              still have them in their material definition and some compilers
//              don't like them being redefined. Easiest fix for now is to undefine them.

#ifdef ENABLE_LIGHTING
#undef ENABLE_LIGHTING
#endif

#ifdef ENABLE_DIFFUSE_LIGHTING
#undef ENABLE_DIFFUSE_LIGHTING
#endif

#ifdef ENABLE_SPECULAR_LIGHTING
#undef ENABLE_SPECULAR_LIGHTING
#endif

#ifdef ENABLE_TONE_MAPPING
#undef ENABLE_TONE_MAPPING
#endif

//-----------------------------------------------------------------------

#define ENABLE_LIGHTING true
#define ENABLE_DIFFUSE_LIGHTING true
#define ENABLE_SPECULAR_LIGHTING true
#define ENABLE_TONE_MAPPING


//-----------------------------------------------------------------------



//-----------------------------------------------------------------------


//-----------------------------------------------------------------------
// Standard defines
//-----------------------------------------------------------------------


#pragma paste_to_backend_at_the_top_begin

#pragma paste_to_backend_at_the_top_end


//-----------------------------------------------------------------------
// Standard includes
//-----------------------------------------------------------------------

#include <std3.glsl>
#include <std3_vs.glsl>
#include <std3_texture.glsl>
#include <std3_fs.glsl>
#include <std3_ssao.glsl>
#include <std3_taa.glsl>
#include <std3_voxelData.glsl>

#if defined(SC_ENABLE_RT_CASTER) && !SC_RT_RECEIVER_MODE
#include <std3_proxy.glsl>
#endif


#if defined(SC_ENABLE_RT_RECEIVER)
#include <std3_receiver.glsl>
#endif




//-------------------
// Global defines
//-------------------

#define SCENARIUM

#ifdef SC_BACKEND_LANGUAGE_MOBILE
#define MOBILE
#endif

#ifdef SC_BACKEND_LANGUAGE_GL
const bool DEVICE_IS_FAST = SC_DEVICE_CLASS >= SC_DEVICE_CLASS_C && bool(SC_GL_FRAGMENT_PRECISION_HIGH);
#else
const bool DEVICE_IS_FAST = SC_DEVICE_CLASS >= SC_DEVICE_CLASS_C;
#endif

const bool SC_ENABLE_SRGB_EMULATION_IN_SHADER = true;


//-----------------------------------------------------------------------
// Varyings
//-----------------------------------------------------------------------

varying vec4 varColor;

//-----------------------------------------------------------------------
// User includes
//-----------------------------------------------------------------------
#include "includes/utils.glsl"		

#if !SC_RT_RECEIVER_MODE
#include "includes/blend_modes.glsl"
#include "includes/oit.glsl" 
#endif
#include "includes/rgbhsl.glsl"
#include "includes/uniforms.glsl"

//-----------------------------------------------------------------------

// The next 60 or so lines of code are for debugging support, live tweaks, node previews, etc and will be included in a 
// shared glsl file.

//-----------------------------------------------------------------------

// Hack for now to know if a shader is running in Studio or on a released lens

#if !defined(MOBILE) && !NODEFLEX
#define STUDIO
#endif

//-----------------------------------------------------------------------

//-----------------------------------------------------------------------
// Basic Macros
//-----------------------------------------------------------------------

// Time Overrides

uniform       int   overrideTimeEnabled;
uniform highp float overrideTimeElapsed[32];
uniform highp float overrideTimeDelta;

//-----------------------------------------------------------------------

#if defined( STUDIO )
#define ssConstOrUniformPrecision	uniform NF_PRECISION
#define ssConstOrUniform			uniform
#else
#define ssConstOrUniformPrecision   const
#define ssConstOrUniform    		const
#endif

//--------------------------------------------------------

// When compiling the shader for rendering in a node-based editor, we need any unconnected dynamic input port's value to
// be tweakable in real-time so we expose it to the engine as a uniform. If we're compiling the shader for a release build
// we use a literal or const value

#if defined( STUDIO )
#define NF_PORT_CONSTANT( xValue, xUniform )	xUniform
#else
#define NF_PORT_CONSTANT( xValue, xUniform )	xValue
#endif

//--------------------------------------------------------

#define float2   vec2
#define float3   vec3
#define float4   vec4
#define bool2    bvec2
#define bool3    bvec3
#define bool4    bvec4
#define float2x2 mat2
#define float3x3 mat3
#define float4x4 mat4

//--------------------------------------------------------

#define ssConditional( C, A, B ) ( ( C * 1.0 != 0.0 ) ? A : B )
#define ssEqual( A, B )          ( ( A == B ) ? 1.0 : 0.0 )
#define ssNotEqual( A, B )       ( ( A == B ) ? 0.0 : 1.0 )
#define ssLarger( A, B )         ( ( A > B ) ? 1.0 : 0.0 )
#define ssLargerOrEqual( A, B )  ( ( A >= B ) ? 1.0 : 0.0 )
#define ssSmaller( A,  B ) 		 ( ( A < B ) ? 1.0 : 0.0 )
#define ssSmallerOrEqual( A, B ) ( ( A <= B ) ? 1.0 : 0.0 )
#define ssNot( A ) 		         ( ( A * 1.0 != 0.0 ) ? 0.0 : 1.0 )

int ssIntMod( int x, int y ) { return x - y * ( x / y ); }

#define ssPRECISION_LIMITER( Value ) Value = floor( Value * 10000.0 ) * 0.0001;
#define ssPRECISION_LIMITER2( Value ) Value = floor( Value * 2000.0 + 0.5 ) * 0.0005;

#define ssDELTA_TIME_MIN 0.00

//--------------------------------------------------------

float ssSRGB_to_Linear( float value ) { return ( DEVICE_IS_FAST ) ? pow( value, 2.2 ) : value * value; }
vec2  ssSRGB_to_Linear( vec2  value ) { return ( DEVICE_IS_FAST ) ? vec2( pow( value.x, 2.2 ), pow( value.y, 2.2 ) ) : value * value; }
vec3  ssSRGB_to_Linear( vec3  value ) { return ( DEVICE_IS_FAST ) ? vec3( pow( value.x, 2.2 ), pow( value.y, 2.2 ), pow( value.z, 2.2 ) ) : value * value; }
vec4  ssSRGB_to_Linear( vec4  value ) { return ( DEVICE_IS_FAST ) ? vec4( pow( value.x, 2.2 ), pow( value.y, 2.2 ), pow( value.z, 2.2 ), pow( value.w, 2.2 ) ) : value * value; }

float ssLinear_to_SRGB( float value ) { return ( DEVICE_IS_FAST ) ? pow( value, 0.45454545 ) : sqrt( value ); }
vec2  ssLinear_to_SRGB( vec2  value ) { return ( DEVICE_IS_FAST ) ? vec2( pow( value.x, 0.45454545 ), pow( value.y, 0.45454545 ) ) : sqrt( value ); }
vec3  ssLinear_to_SRGB( vec3  value ) { return ( DEVICE_IS_FAST ) ? vec3( pow( value.x, 0.45454545 ), pow( value.y, 0.45454545 ), pow( value.z, 0.45454545 ) ) : sqrt( value ); }
vec4  ssLinear_to_SRGB( vec4  value ) { return ( DEVICE_IS_FAST ) ? vec4( pow( value.x, 0.45454545 ), pow( value.y, 0.45454545 ), pow( value.z, 0.45454545 ), pow( value.w, 0.45454545 ) ) : sqrt( value ); }

//--------------------------------------------------------

float3 ssWorldToNDC( float3 posWS, mat4 ViewProjectionMatrix )
{
	float4 ScreenVector = ViewProjectionMatrix * float4( posWS, 1.0 );
	return ScreenVector.xyz / ScreenVector.w;
}

//-------------------

float  Dummy1;
float2 Dummy2;
float3 Dummy3;
float4 Dummy4;


int ssInstanceID;

// When calling matrices in NGS, please use the global functions defined in the Matrix node
// This ensures their respective flags are set correctly for VFX, eg. ngsViewMatrix --> ssGetGlobal_Matrix_View()
#define ngsLocalAabbMin						sc_LocalAabbMin
#define ngsWorldAabbMin						sc_WorldAabbMin
#define ngsLocalAabbMax						sc_LocalAabbMax
#define ngsWorldAabbMax						sc_WorldAabbMax
#define ngsCameraAspect 					sc_Camera.aspect;
#define ngsCameraNear                       sc_Camera.clipPlanes.x
#define ngsCameraFar                        sc_Camera.clipPlanes.y
#define ngsCameraPosition                   sc_Camera.position
#define ngsModelMatrix                      sc_ModelMatrix							//ssGetGlobal_Matrix_World()
#define ngsPrevFrameModelMatrix             sc_PrevFrameModelMatrix					//ssGetGlobal_Matrix_PrevFrameWorld()
#define ngsModelMatrixInverse               sc_ModelMatrixInverse					//ssGetGlobal_Matrix_World_Inverse()
#define ngsModelViewMatrix                  sc_ModelViewMatrix						//ssGetGlobal_Matrix_World_View()
#define ngsModelViewMatrixInverse           sc_ModelViewMatrixInverse				//ssGetGlobal_Matrix_World_View_Inverse()
#define ngsProjectionMatrix                 sc_ProjectionMatrix						//ssGetGlobal_Matrix_World_View_Projection()
#define ngsProjectionMatrixInverse          sc_ProjectionMatrixInverse				//ssGetGlobal_Matrix_World_View_Projection_Inverse()
#define ngsModelViewProjectionMatrix        sc_ModelViewProjectionMatrix			//ssGetGlobal_Matrix_Projection()
#define ngsModelViewProjectionMatrixInverse sc_ModelViewProjectionMatrixInverse		//ssGetGlobal_Matrix_Projection_Inverse()
#define ngsViewMatrix                       sc_ViewMatrix							//ssGetGlobal_Matrix_View()
#define ngsViewMatrixInverse                sc_ViewMatrixInverse					//ssGetGlobal_Matrix_View_Inverse()
#define ngsViewProjectionMatrix             sc_ViewProjectionMatrix					//ssGetGlobal_Matrix_View_Projection()
#define ngsViewProjectionMatrixInverse      sc_ViewProjectionMatrixInverse			//ssGetGlobal_Matrix_View_Projection_Inverse()
#define ngsCameraUp 					    sc_ViewMatrixInverse[1].xyz
#define ngsCameraForward                    -sc_ViewMatrixInverse[2].xyz
#define ngsCameraRight                      sc_ViewMatrixInverse[0].xyz
#define ngsFrame 		                    0

//--------------------------------------------------------


#if defined( STUDIO )

struct ssPreviewInfo
{
	float4 Color;
	bool   Saved;
};

ssPreviewInfo PreviewInfo;

uniform NF_PRECISION int PreviewEnabled; // PreviewEnabled is set to 1 by the renderer when Lens Studio is rendering node previews
uniform NF_PRECISION int PreviewNodeID;  // PreviewNodeID is set to the node's ID that a preview is being rendered for

varying float4 PreviewVertexColor;
varying float  PreviewVertexSaved;

#define NF_DISABLE_VERTEX_CHANGES()					( PreviewEnabled == 1 )			
#define NF_SETUP_PREVIEW_VERTEX()					PreviewInfo.Color = PreviewVertexColor = float4( 0.5 ); PreviewInfo.Saved = false; PreviewVertexSaved = 0.0;
#define NF_SETUP_PREVIEW_PIXEL()					PreviewInfo.Color = PreviewVertexColor; PreviewInfo.Saved = ( PreviewVertexSaved * 1.0 != 0.0 ) ? true : false;
#define NF_PREVIEW_SAVE( xCode, xNodeID, xAlpha ) 	if ( PreviewEnabled == 1 && !PreviewInfo.Saved && xNodeID == PreviewNodeID ) { PreviewInfo.Saved = true; { PreviewInfo.Color = xCode; if ( !xAlpha ) PreviewInfo.Color.a = 1.0; } }
#define NF_PREVIEW_FORCE_SAVE( xCode ) 				if ( PreviewEnabled == 0 ) { PreviewInfo.Saved = true; { PreviewInfo.Color = xCode; } }
#define NF_PREVIEW_OUTPUT_VERTEX()					if ( PreviewInfo.Saved ) { PreviewVertexColor = float4( PreviewInfo.Color.rgb, 1.0 ); PreviewVertexSaved = 1.0; }
#define NF_PREVIEW_OUTPUT_PIXEL()					if ( PreviewEnabled == 1 ) { if ( PreviewInfo.Saved ) { FinalColor = float4( PreviewInfo.Color ); } else { FinalColor = vec4( 0.0, 0.0, 0.0, 0.0 ); /*FinalColor.a = 1.0;*/ /* this will be an option later */ }  }

#else

#define NF_DISABLE_VERTEX_CHANGES()					false			
#define NF_SETUP_PREVIEW_VERTEX()
#define NF_SETUP_PREVIEW_PIXEL()
#define NF_PREVIEW_SAVE( xCode, xNodeID, xAlpha )
#define NF_PREVIEW_FORCE_SAVE( xCode )
#define NF_PREVIEW_OUTPUT_VERTEX()
#define NF_PREVIEW_OUTPUT_PIXEL()

#endif


//--------------------------------------------------------



//--------------------------------------------------------

#ifdef VERTEX_SHADER

//--------------------------------------------------------

in vec4 color;

//--------------------------------------------------------

void ngsVertexShaderBegin( out sc_Vertex_t v )
{
	v = sc_LoadVertexAttributes();
	
	if ( sc_Voxelization )
	{
		processVoxelizationBeginVS(v);
	}
	
	
	ssInstanceID = sc_LocalInstanceID;
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	
	sc_BlendVertex(v);
	sc_SkinVertex(v);
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( sc_RenderingSpace == SC_RENDERING_SPACE_SCREEN )
	{
		varPos         = vec3( 0.0 );
		varNormal      = v.normal;
		varTangent.xyz = v.tangent;
	}
	else if ( sc_RenderingSpace == SC_RENDERING_SPACE_SCREEN_MV )
	{
		varPos         = vec3( 0.0 );
		varNormal      = v.normal;
		varTangent.xyz = v.tangent;
	}
	else if ( sc_RenderingSpace == SC_RENDERING_SPACE_WORLD )
	{				
		varPos         = v.position.xyz;
		varNormal      = v.normal;
		varTangent.xyz = v.tangent;
	}
	else if ( sc_RenderingSpace == SC_RENDERING_SPACE_OBJECT )
	{
		varPos         = (sc_ModelMatrix * v.position).xyz;
		varNormal      = sc_NormalMatrix * v.normal;
		varTangent.xyz = sc_NormalMatrix * v.tangent;
	}
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	#if !defined(MOBILE)
	if ( PreviewEnabled == 1 )
	v.texture0.x = 1.0 - v.texture0.x; // fix to flip the preview quad UVs horizontally
	#endif
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	varColor = color;
}			

//--------------------------------------------------------

void ngsVertexShaderEnd( inout sc_Vertex_t v, vec3 WorldPosition, vec3 WorldNormal, vec3 WorldTangent, vec4 ScreenPosition )
{
	varPos          = WorldPosition; 
	varNormal       = normalize( WorldNormal );
	varTangent.xyz  = normalize( WorldTangent );
	varTangent.w    = tangent.w;
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( bool( UseViewSpaceDepthVariant ) && ( bool( sc_OITDepthGatherPass ) || bool( sc_OITCompositingPass ) || bool( sc_OITDepthBoundsPass ) ) )
	{
		varViewSpaceDepth = -sc_ObjectToView( v.position ).z;
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	float4 screenPosition = float4( 0.0 );
	
	if ( sc_RenderingSpace == SC_RENDERING_SPACE_SCREEN )
	{
		screenPosition = ScreenPosition; 
	}
	else if ( sc_RenderingSpace == SC_RENDERING_SPACE_SCREEN_MV )
	{
		screenPosition = ( ngsModelViewMatrix * v.position ) * vec4( 1.0 / sc_Camera.aspect, 1.0, 1.0, 1.0 );
	}
	else if ( sc_RenderingSpace == SC_RENDERING_SPACE_WORLD )
	{
		screenPosition = ngsViewProjectionMatrix * float4( varPos.xyz, 1.0 );
	}
	else if ( sc_RenderingSpace == SC_RENDERING_SPACE_OBJECT )
	{
		screenPosition = ngsViewProjectionMatrix * float4( varPos.xyz, 1.0 );
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	varTex01 = vec4( v.texture0, v.texture1 );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( bool( sc_ProjectiveShadowsReceiver ) )
	{
		varShadowTex = getProjectedTexCoords(v.position);
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	screenPosition = applyDepthAlgorithm(screenPosition); 
	screenPosition = sc_ApplyTAAJitter(screenPosition); 
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	sc_SetClipPosition( screenPosition );
	if ( sc_Voxelization )
	{
		processVoxelizationEndVS(v);
		
	}
	else if ( sc_OutputBounds )
	{
		processOutputDepthBoundsVS(v);
	}
}

//--------------------------------------------------------

#endif //VERTEX_SHADER

//--------------------------------------------------------

float3 ssGetScreenPositionNDC( float4 vertexPosition, float3 positionWS, mat4 viewProjectionMatrix )
{
	float3 screenPosition = vec3( 0.0 );
	
	#ifdef VERTEX_SHADER
	
	if ( sc_RenderingSpace == SC_RENDERING_SPACE_SCREEN )
	{
		screenPosition = vertexPosition.xyz;
	}
	else
	{
		screenPosition = ssWorldToNDC( positionWS, viewProjectionMatrix );
	}
	
	#endif
	
	return screenPosition;
}

//--------------------------------------------------------

uniform NF_PRECISION float alphaTestThreshold;

#ifdef FRAGMENT_SHADER

void ngsAlphaTest( float opacity )
{
	if ( sc_BlendMode_AlphaTest )
	{
		if ( opacity < alphaTestThreshold )
		{
			discard;
		}
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( ENABLE_STIPPLE_PATTERN_TEST )
	{
		vec2  localCoord = floor(mod(sc_GetGlFragCoord().xy, vec2(4.0)));
		float threshold  = (mod(dot(localCoord, vec2(4.0, 1.0)) * 9.0, 16.0) + 1.0) / 17.0;
		
		if ( opacity < threshold )
		{
			discard;
		}
	}
}

#endif // #ifdef FRAGMENT_SHADER

#ifdef FRAGMENT_SHADER
#if !SC_RT_RECEIVER_MODE
vec4 ngsPixelShader( vec4 result ) 
{	
	if ( sc_ProjectiveShadowsCaster )
	{
		result = evaluateShadowCasterColor( result );
	}
	else if ( sc_RenderAlphaToColor )
	{
		result = vec4(result.a);
	}
	else if ( sc_BlendMode_Custom )
	{
		result = applyCustomBlend(result);
	}
	else if ( sc_Voxelization )
	{
		result = processVoxelizationFS(result);
		
	}
	else if ( sc_OutputBounds )
	{
		result = processOutputBoundsFS(result);
		
	}
	else
	{
		result = sc_ApplyBlendModeModifications(result);
	}
	
	return result;
}
#endif
#endif


//-----------------------------------------------------------------------


// Spec Consts

SPEC_CONST(int) NODE_38_DROPLIST_ITEM = 0;
SPEC_CONST(bool) Tweak_N37 = false;
SPEC_CONST(bool) Tweak_N121 = false;
SPEC_CONST(int) NODE_27_DROPLIST_ITEM = 0;
SPEC_CONST(bool) Tweak_N67 = false;
SPEC_CONST(bool) uv2EnableAnimation = false;
SPEC_CONST(int) NODE_13_DROPLIST_ITEM = 0;
SPEC_CONST(bool) Tweak_N11 = false;
SPEC_CONST(bool) uv3EnableAnimation = false;
SPEC_CONST(int) NODE_49_DROPLIST_ITEM = 0;
SPEC_CONST(bool) Tweak_N308 = false;
SPEC_CONST(int) NODE_69_DROPLIST_ITEM = 0;
SPEC_CONST(bool) Tweak_N354 = false;
SPEC_CONST(int) NODE_181_DROPLIST_ITEM = 0;
SPEC_CONST(bool) Tweak_N218 = false;
SPEC_CONST(int) NODE_184_DROPLIST_ITEM = 0;
SPEC_CONST(bool) Tweak_N223 = false;
SPEC_CONST(int) NODE_76_DROPLIST_ITEM = 0;
SPEC_CONST(bool) Tweak_N179 = false;
SPEC_CONST(bool) Tweak_N177 = false;
SPEC_CONST(int) NODE_228_DROPLIST_ITEM = 0;
SPEC_CONST(bool) Tweak_N74 = false;
SPEC_CONST(bool) Tweak_N216 = false;
SPEC_CONST(int) NODE_315_DROPLIST_ITEM = 0;
SPEC_CONST(bool) rimInvert = false;
SPEC_CONST(int) NODE_221_DROPLIST_ITEM = 0;
SPEC_CONST(bool) Tweak_N219 = false;


// Material Parameters ( Tweaks )

uniform NF_PRECISION                            float3 recolorRed; // Title: Recolor Red
uniform NF_PRECISION                            float4 baseColor; // Title: Base Color
SC_DECLARE_TEXTURE(baseTex); //                 Title: Texture
uniform NF_PRECISION                            float2 uv2Scale; // Title: Scale
uniform NF_PRECISION                            float2 uv2Offset; // Title: Offset
uniform NF_PRECISION                            float2 uv3Scale; // Title: Scale
uniform NF_PRECISION                            float2 uv3Offset; // Title: Offset
uniform NF_PRECISION                            float3 recolorGreen; // Title: Recolor Green
uniform NF_PRECISION                            float3 recolorBlue; // Title: Recolor Blue
SC_DECLARE_TEXTURE(opacityTex); //              Title: Texture
SC_DECLARE_TEXTURE(normalTex); //               Title: Texture
SC_DECLARE_TEXTURE(detailNormalTex); //         Title: Texture
SC_DECLARE_TEXTURE(emissiveTex); //             Title: Texture
uniform NF_PRECISION                            float3 emissiveColor; // Title: Color
uniform NF_PRECISION                            float  emissiveIntensity; // Title: Intensity
uniform NF_PRECISION                            float  reflectionIntensity; // Title: Intensity
SC_DECLARE_TEXTURE(reflectionTex); //           Title: Texture
SC_DECLARE_TEXTURE(reflectionModulationTex); // Title: Texture
uniform NF_PRECISION                            float3 rimColor; // Title: Color
uniform NF_PRECISION                            float  rimIntensity; // Title: Intensity
SC_DECLARE_TEXTURE(rimColorTex); //             Title: Texture
uniform NF_PRECISION                            float  rimExponent; // Title: Exponent
uniform NF_PRECISION                            float  metallic; // Title: Metallic
SC_DECLARE_TEXTURE(materialParamsTex); //       Title: Texture
uniform NF_PRECISION                            float  roughness; // Title: Roughness
uniform NF_PRECISION                            float  specularAoDarkening; // Title: Darkening
uniform NF_PRECISION                            float  specularAoIntensity; // Title: Intensity	


// Uniforms ( Ports )

#if defined( STUDIO )
uniform NF_PRECISION float4 Port_Import_N042;
uniform NF_PRECISION float Port_Input1_N044;
uniform NF_PRECISION float Port_Import_N088;
uniform NF_PRECISION float3 Port_Import_N089;
uniform NF_PRECISION float4 Port_Import_N384;
uniform NF_PRECISION float Port_Import_N307;
uniform NF_PRECISION float Port_Import_N201;
uniform NF_PRECISION float Port_Import_N012;
uniform NF_PRECISION float Port_Import_N010;
uniform NF_PRECISION float Port_Import_N007;
uniform NF_PRECISION float2 Port_Import_N008;
uniform NF_PRECISION float2 Port_Import_N009;
uniform NF_PRECISION float Port_Speed_N022;
uniform NF_PRECISION float2 Port_Import_N254;
uniform NF_PRECISION float Port_Import_N065;
uniform NF_PRECISION float Port_Import_N055;
uniform NF_PRECISION float Port_Import_N056;
uniform NF_PRECISION float2 Port_Import_N000;
uniform NF_PRECISION float2 Port_Import_N060;
uniform NF_PRECISION float2 Port_Import_N061;
uniform NF_PRECISION float Port_Speed_N063;
uniform NF_PRECISION float2 Port_Import_N255;
uniform NF_PRECISION float4 Port_Default_N369;
uniform NF_PRECISION float4 Port_Import_N092;
uniform NF_PRECISION float3 Port_Import_N090;
uniform NF_PRECISION float3 Port_Import_N091;
uniform NF_PRECISION float3 Port_Import_N144;
uniform NF_PRECISION float Port_Value2_N073;
uniform NF_PRECISION float4 Port_Import_N166;
uniform NF_PRECISION float Port_Import_N206;
uniform NF_PRECISION float Port_Import_N043;
uniform NF_PRECISION float2 Port_Import_N151;
uniform NF_PRECISION float2 Port_Import_N155;
uniform NF_PRECISION float Port_Default_N204;
uniform NF_PRECISION float Port_Import_N047;
uniform NF_PRECISION float Port_Input1_N002;
uniform NF_PRECISION float Port_Input2_N072;
uniform NF_PRECISION float Port_Import_N336;
uniform NF_PRECISION float Port_Import_N160;
uniform NF_PRECISION float2 Port_Import_N167;
uniform NF_PRECISION float2 Port_Import_N207;
uniform NF_PRECISION float Port_Strength1_N200;
uniform NF_PRECISION float Port_Import_N095;
uniform NF_PRECISION float Port_Import_N108;
uniform NF_PRECISION float3 Port_Default_N113;
uniform NF_PRECISION float Port_Strength2_N200;
uniform NF_PRECISION float Port_Import_N273;
uniform NF_PRECISION float Port_Input1_N274;
uniform NF_PRECISION float Port_Import_N131;
uniform NF_PRECISION float Port_Import_N116;
uniform NF_PRECISION float2 Port_Import_N120;
uniform NF_PRECISION float2 Port_Import_N127;
uniform NF_PRECISION float3 Port_Default_N132;
uniform NF_PRECISION float3 Port_Import_N295;
uniform NF_PRECISION float Port_Import_N296;
uniform NF_PRECISION float3 Port_Default_N103;
uniform NF_PRECISION float Port_Import_N133;
uniform NF_PRECISION float Port_Import_N231;
uniform NF_PRECISION float3 Port_Import_N327;
uniform NF_PRECISION float3 Port_Input1_N257;
uniform NF_PRECISION float3 Port_Import_N259;
uniform NF_PRECISION float Port_Input1_N264;
uniform NF_PRECISION float Port_Input1_N268;
uniform NF_PRECISION float Port_Input1_N270;
uniform NF_PRECISION float Port_Import_N123;
uniform NF_PRECISION float Port_Import_N025;
uniform NF_PRECISION float2 Port_Import_N030;
uniform NF_PRECISION float2 Port_Import_N031;
uniform NF_PRECISION float3 Port_Default_N041;
uniform NF_PRECISION float3 Port_Default_N134;
uniform NF_PRECISION float3 Port_Import_N298;
uniform NF_PRECISION float Port_Import_N172;
uniform NF_PRECISION float3 Port_Import_N318;
uniform NF_PRECISION float Port_Import_N319;
uniform NF_PRECISION float Port_Import_N171;
uniform NF_PRECISION float Port_Import_N135;
uniform NF_PRECISION float2 Port_Import_N150;
uniform NF_PRECISION float2 Port_Import_N152;
uniform NF_PRECISION float3 Port_Default_N170;
uniform NF_PRECISION float Port_Import_N339;
uniform NF_PRECISION float3 Port_Import_N328;
uniform NF_PRECISION float Port_Import_N340;
uniform NF_PRECISION float3 Port_Default_N173;
uniform NF_PRECISION float3 Port_Import_N306;
uniform NF_PRECISION float Port_Import_N277;
uniform NF_PRECISION float Port_Import_N280;
uniform NF_PRECISION float2 Port_Import_N241;
uniform NF_PRECISION float2 Port_Import_N246;
uniform NF_PRECISION float Port_Import_N278;
uniform NF_PRECISION float Port_Import_N186;
uniform NF_PRECISION float Port_Input1_N187;
uniform NF_PRECISION float Port_Import_N078;
uniform NF_PRECISION float3 Port_Value1_N079;
uniform NF_PRECISION float Port_Import_N281;
uniform NF_PRECISION float3 Port_Input0_N325;
uniform NF_PRECISION float Port_Import_N283;
uniform NF_PRECISION float3 Port_Input0_N239;
uniform NF_PRECISION float3 Port_Import_N235;
uniform NF_PRECISION float3 Port_Input1_N322;
uniform NF_PRECISION float Port_Import_N282;
uniform NF_PRECISION float3 Port_Default_N326;
#endif	



//-----------------------------------------------------------------------


#if defined(SC_ENABLE_RT_CASTER)
uniform highp float depthRef;
#endif


//-----------------------------------------------------------------------

#ifdef VERTEX_SHADER

//----------

// Globals

struct ssGlobals
{
	float gTimeElapsed;
	float gTimeDelta;
	float gTimeElapsedShifted;
	
	
};

ssGlobals tempGlobals;
#define scCustomCodeUniform

//-----------------------------------------------------------------------

void main() 
{
	
	#if defined(SC_ENABLE_RT_CASTER) && !SC_RT_RECEIVER_MODE
	if (bool(sc_ProxyMode)) {
		sc_SetClipPosition(vec4(position.xy, depthRef + 1e-10 * position.z, 1.0 + 1e-10 * position.w)); // GPU_BUG_028
		return;
	}
	#endif
	
	
	NF_SETUP_PREVIEW_VERTEX()
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	sc_Vertex_t v;
	ngsVertexShaderBegin( v );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	ssGlobals Globals;	
	Globals.gTimeElapsed = sc_TimeElapsed;
	Globals.gTimeDelta   = sc_TimeDelta;
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	float4 ScreenPosition = vec4( 0.0 );
	float3 WorldPosition  = varPos;
	float3 WorldNormal    = varNormal;
	float3 WorldTangent   = varTangent.xyz;
	float3 PrevWorldPosition  = vec3(0);
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	// no vertex transformation needed
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( NF_DISABLE_VERTEX_CHANGES() )
	{
		WorldPosition  = varPos;
		WorldNormal    = varNormal;
		WorldTangent   = varTangent.xyz;
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	ngsVertexShaderEnd( v, WorldPosition, WorldNormal, WorldTangent, v.position );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	
	
	sc_ComputeMotionVectorIfNeeded(varPos);
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	NF_PREVIEW_OUTPUT_VERTEX()
}

//-----------------------------------------------------------------------

#endif // #ifdef VERTEX_SHADER

//-----------------------------------------------------------------------

#ifdef FRAGMENT_SHADER

//-----------------------------------------------------------------------------

//----------

// Defines

#define ENABLE_BITMOJI_SHADING 0	

//----------

// Includes


#include "includes/uber_lighting.glsl"
#include "includes/pbr.glsl"

#if !SC_RT_RECEIVER_MODE
//-----------------------------------------------------------------------

vec4 ngsCalculateLighting( vec3 albedo, float opacity, vec3 normal, vec3 position, vec3 viewDir, vec3 emissive, float metallic, float roughness, vec3 ao, vec3 specularAO )
{
	SurfaceProperties surfaceProperties = defaultSurfaceProperties();
	surfaceProperties.opacity = opacity;
	surfaceProperties.albedo = ssSRGB_to_Linear( albedo );
	surfaceProperties.normal = normalize( normal );
	surfaceProperties.positionWS = position;
	surfaceProperties.viewDirWS = viewDir;
	surfaceProperties.emissive = ssSRGB_to_Linear( emissive );
	surfaceProperties.metallic = metallic;
	surfaceProperties.roughness = roughness;
	surfaceProperties.ao = ao;
	surfaceProperties.specularAo = specularAO;
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	#ifdef ENABLE_LIGHTING
	
	if (sc_SSAOEnabled) {
		surfaceProperties.ao = evaluateSSAO(surfaceProperties.positionWS.xyz);
	}
	
	surfaceProperties = calculateDerivedSurfaceProperties(surfaceProperties);
	LightingComponents lighting = evaluateLighting(surfaceProperties);
	
	#else
	
	LightingComponents lighting = defaultLightingComponents();
	
	#endif
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( sc_BlendMode_ColoredGlass )
	{		
		// Colored glass implies that the surface does not diffusely reflect light, instead it transmits light.
		// The transmitted light is the background multiplied by the color of the glass, taking opacity as strength.
		lighting.directDiffuse = vec3(0.0);
		lighting.indirectDiffuse = vec3(0.0);
		vec3 framebuffer = ssSRGB_to_Linear( sc_GetFramebufferColor().rgb );
		lighting.transmitted = framebuffer * mix(vec3(1.0), surfaceProperties.albedo, surfaceProperties.opacity);
		surfaceProperties.opacity = 1.0; // Since colored glass does its own multiplicative blending (above), forbid any other blending.
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	bool enablePremultipliedAlpha = false;
	
	if ( sc_BlendMode_PremultipliedAlpha )
	{
		enablePremultipliedAlpha = true;
	}						
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	// This is where the lighting and the surface finally come together.
	
	vec4 Output = vec4(combineSurfacePropertiesWithLighting(surfaceProperties, lighting, enablePremultipliedAlpha), surfaceProperties.opacity);
	
	if (sc_IsEditor) {
		// [STUDIO-47088] [HACK 1/8/2024] The wrong lighting environment is in effect, ie: no lighting, when syncShaderProperties() is called.
		// Because the envmap is not enabled at that point, the ao uniforms get dead code removed, and thus they don"t get their values set during real rendering either, so they"re stuck at 0 and envmaps look black. 
		// We force potential uniforms to be active here, so their values can be set correctly during real rendering. 
		Output.r += surfaceProperties.ao.r * surfaceProperties.specularAo.r * 0.00001;
	}
	
	
	#if defined(SC_ENABLE_RT_CASTER) && !SC_RT_RECEIVER_MODE
	if (bool(sc_ProxyMode)) {
		return Output;
	}
	#endif
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	// Tone mapping
	
	if ( !sc_BlendMode_Multiply )
	{
		#if defined(ENABLE_TONE_MAPPING)
		
		Output.rgb = linearToneMapping( Output.rgb );
		
		#endif
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	// sRGB output
	
	Output.rgb = linearToSrgb( Output.rgb );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	return Output;
}	
#endif



//----------

// Globals

struct ssGlobals
{
	float gTimeElapsed;
	float gTimeDelta;
	float gTimeElapsedShifted;
	
	float3 BumpedNormal;
	float3 ViewDirWS;
	float3 PositionWS;
	float4 VertexColor;
	float2 Surface_UVCoord0;
	float2 Surface_UVCoord1;
	float2 gScreenCoord;
	float3 VertexTangent_WorldSpace;
	float3 VertexNormal_WorldSpace;
	float3 VertexBinormal_WorldSpace;
	float3 SurfacePosition_WorldSpace;
};

ssGlobals tempGlobals;
#define scCustomCodeUniform	

//----------

// Functions

#define Node38_DropList_Parameter( Output, Globals ) Output = float( NODE_38_DROPLIST_ITEM )
#define Node42_Float_Import( Import, Value, Globals ) Value = Import
#define Node44_Is_Equal( Input0, Input1, Output, Globals ) Output = ssEqual( Input0, Input1 )
#define Node45_Surface_Color( Color, Globals ) Color = Globals.VertexColor
void Node37_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N37 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node88_Float_Import( Import, Value, Globals ) Value = Import
void Node85_Color_Parameter( out float3 Output, ssGlobals Globals ) { Output = recolorRed; }
#define Node89_Float_Import( Import, Value, Globals ) Value = Import
void Node5_Color_Parameter( out float4 Output, ssGlobals Globals ) { Output = baseColor; }
#define Node384_Float_Import( Import, Value, Globals ) Value = Import
void Node121_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N121 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node307_Float_Import( Import, Value, Globals ) Value = Import
#define Node28_Texture_2D_Object_Parameter( Globals ) /*nothing*/
#define Node199_Texture_Object_2D_Import( Globals ) /*nothing*/
#define Node27_DropList_Parameter( Output, Globals ) Output = float( NODE_27_DROPLIST_ITEM )
#define Node201_Float_Import( Import, Value, Globals ) Value = Import
#define Node386_Surface_UV_Coord( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord0
#define Node387_Surface_UV_Coord_1( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord1
void Node67_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N67 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node12_Float_Import( Import, Value, Globals ) Value = Import
void Node16_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( uv2EnableAnimation )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node10_Float_Import( Import, Value, Globals ) Value = Import
#define Node13_DropList_Parameter( Output, Globals ) Output = float( NODE_13_DROPLIST_ITEM )
#define Node7_Float_Import( Import, Value, Globals ) Value = Import
#define Node18_Surface_UV_Coord( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord0
#define Node19_Surface_UV_Coord_1( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord1
#define Node20_Screen_UV_Coord( ScreenCoord, Globals ) ScreenCoord = Globals.gScreenCoord
void Node17_Switch( in float Switch, in float2 Value0, in float2 Value1, in float2 Value2, in float2 Default, out float2 Result, ssGlobals Globals )
{ 
	if ( int( NODE_13_DROPLIST_ITEM ) == 0 )
	{
		/* Input port: "Value0"  */
		
		{
			float2 UVCoord_N18 = float2(0.0); Node18_Surface_UV_Coord( UVCoord_N18, Globals );
			
			Value0 = UVCoord_N18;
		}
		Result = Value0;
	}
	else if ( int( NODE_13_DROPLIST_ITEM ) == 1 )
	{
		/* Input port: "Value1"  */
		
		{
			float2 UVCoord_N19 = float2(0.0); Node19_Surface_UV_Coord_1( UVCoord_N19, Globals );
			
			Value1 = UVCoord_N19;
		}
		Result = Value1;
	}
	else if ( int( NODE_13_DROPLIST_ITEM ) == 2 )
	{
		/* Input port: "Value2"  */
		
		{
			float2 ScreenCoord_N20 = float2(0.0); Node20_Screen_UV_Coord( ScreenCoord_N20, Globals );
			
			Value2 = ScreenCoord_N20;
		}
		Result = Value2;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float2 UVCoord_N18 = float2(0.0); Node18_Surface_UV_Coord( UVCoord_N18, Globals );
			
			Default = UVCoord_N18;
		}
		Result = Default;
	}
}
void Node14_Float_Parameter( out float2 Output, ssGlobals Globals ) { Output = uv2Scale; }
#define Node8_Float_Import( Import, Value, Globals ) Value = Import
void Node15_Float_Parameter( out float2 Output, ssGlobals Globals ) { Output = uv2Offset; }
#define Node9_Float_Import( Import, Value, Globals ) Value = Import
#define Node21_Scale_and_Offset( Input0, Input1, Input2, Output, Globals ) Output = Input0 * Input1 + Input2
#define Node22_Scroll_Coords( CoordsIn, Direction, Speed, CoordsOut, Globals ) CoordsOut = CoordsIn + ( Globals.gTimeElapsed * Speed * Direction )
void Node122_If_else( in float Bool1, in float2 Value1, in float2 Default, out float2 Result, ssGlobals Globals )
{ 
	if ( bool( uv2EnableAnimation ) )
	{
		/* Input port: "Value1"  */
		
		{
			float2 Result_N17 = float2(0.0); Node17_Switch( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N17, Globals );
			float2 Output_N14 = float2(0.0); Node14_Float_Parameter( Output_N14, Globals );
			float2 Value_N8 = float2(0.0); Node8_Float_Import( Output_N14, Value_N8, Globals );
			float2 Output_N15 = float2(0.0); Node15_Float_Parameter( Output_N15, Globals );
			float2 Value_N9 = float2(0.0); Node9_Float_Import( Output_N15, Value_N9, Globals );
			float2 Output_N21 = float2(0.0); Node21_Scale_and_Offset( Result_N17, Value_N8, Value_N9, Output_N21, Globals );
			float2 CoordsOut_N22 = float2(0.0); Node22_Scroll_Coords( Output_N21, Value_N9, NF_PORT_CONSTANT( float( 1.0 ), Port_Speed_N022 ), CoordsOut_N22, Globals );
			
			Value1 = CoordsOut_N22;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float2 Result_N17 = float2(0.0); Node17_Switch( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N17, Globals );
			float2 Output_N14 = float2(0.0); Node14_Float_Parameter( Output_N14, Globals );
			float2 Value_N8 = float2(0.0); Node8_Float_Import( Output_N14, Value_N8, Globals );
			float2 Output_N15 = float2(0.0); Node15_Float_Parameter( Output_N15, Globals );
			float2 Value_N9 = float2(0.0); Node9_Float_Import( Output_N15, Value_N9, Globals );
			float2 Output_N21 = float2(0.0); Node21_Scale_and_Offset( Result_N17, Value_N8, Value_N9, Output_N21, Globals );
			
			Default = Output_N21;
		}
		Result = Default;
	}
}
void Node1_If_else( in float Bool1, in float2 Value1, in float2 Default, out float2 Result, ssGlobals Globals )
{ 
	if ( bool( Tweak_N67 ) )
	{
		/* Input port: "Value1"  */
		
		{
			float2 Result_N122 = float2(0.0); Node122_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N122, Globals );
			
			Value1 = Result_N122;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float2 UVCoord_N18 = float2(0.0); Node18_Surface_UV_Coord( UVCoord_N18, Globals );
			
			Default = UVCoord_N18;
		}
		Result = Default;
	}
}
#define Node23_Float_Export( Value, Export, Globals ) Export = Value
#define Node254_Float_Import( Import, Value, Globals ) Value = Import
void Node11_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N11 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node65_Float_Import( Import, Value, Globals ) Value = Import
void Node52_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( uv3EnableAnimation )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node55_Float_Import( Import, Value, Globals ) Value = Import
#define Node49_DropList_Parameter( Output, Globals ) Output = float( NODE_49_DROPLIST_ITEM )
#define Node56_Float_Import( Import, Value, Globals ) Value = Import
#define Node54_Surface_UV_Coord( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord0
#define Node57_Surface_UV_Coord_1( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord1
#define Node58_Screen_UV_Coord( ScreenCoord, Globals ) ScreenCoord = Globals.gScreenCoord
#define Node0_Float_Import( Import, Value, Globals ) Value = Import
void Node59_Switch( in float Switch, in float2 Value0, in float2 Value1, in float2 Value2, in float2 Value3, in float2 Default, out float2 Result, ssGlobals Globals )
{ 
	if ( int( NODE_49_DROPLIST_ITEM ) == 0 )
	{
		/* Input port: "Value0"  */
		
		{
			float2 UVCoord_N54 = float2(0.0); Node54_Surface_UV_Coord( UVCoord_N54, Globals );
			
			Value0 = UVCoord_N54;
		}
		Result = Value0;
	}
	else if ( int( NODE_49_DROPLIST_ITEM ) == 1 )
	{
		/* Input port: "Value1"  */
		
		{
			float2 UVCoord_N57 = float2(0.0); Node57_Surface_UV_Coord_1( UVCoord_N57, Globals );
			
			Value1 = UVCoord_N57;
		}
		Result = Value1;
	}
	else if ( int( NODE_49_DROPLIST_ITEM ) == 2 )
	{
		/* Input port: "Value2"  */
		
		{
			float2 ScreenCoord_N58 = float2(0.0); Node58_Screen_UV_Coord( ScreenCoord_N58, Globals );
			
			Value2 = ScreenCoord_N58;
		}
		Result = Value2;
	}
	else if ( int( NODE_49_DROPLIST_ITEM ) == 3 )
	{
		/* Input port: "Value3"  */
		
		{
			float2 Result_N1 = float2(0.0); Node1_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N1, Globals );
			float2 Export_N23 = float2(0.0); Node23_Float_Export( Result_N1, Export_N23, Globals );
			float2 Value_N0 = float2(0.0); Node0_Float_Import( Export_N23, Value_N0, Globals );
			
			Value3 = Value_N0;
		}
		Result = Value3;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float2 UVCoord_N54 = float2(0.0); Node54_Surface_UV_Coord( UVCoord_N54, Globals );
			
			Default = UVCoord_N54;
		}
		Result = Default;
	}
}
void Node50_Float_Parameter( out float2 Output, ssGlobals Globals ) { Output = uv3Scale; }
#define Node60_Float_Import( Import, Value, Globals ) Value = Import
void Node51_Float_Parameter( out float2 Output, ssGlobals Globals ) { Output = uv3Offset; }
#define Node61_Float_Import( Import, Value, Globals ) Value = Import
#define Node62_Scale_and_Offset( Input0, Input1, Input2, Output, Globals ) Output = Input0 * Input1 + Input2
#define Node63_Scroll_Coords( CoordsIn, Direction, Speed, CoordsOut, Globals ) CoordsOut = CoordsIn + ( Globals.gTimeElapsed * Speed * Direction )
void Node64_If_else( in float Bool1, in float2 Value1, in float2 Default, out float2 Result, ssGlobals Globals )
{ 
	if ( bool( uv3EnableAnimation ) )
	{
		/* Input port: "Value1"  */
		
		{
			float2 Result_N59 = float2(0.0); Node59_Switch( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N59, Globals );
			float2 Output_N50 = float2(0.0); Node50_Float_Parameter( Output_N50, Globals );
			float2 Value_N60 = float2(0.0); Node60_Float_Import( Output_N50, Value_N60, Globals );
			float2 Output_N51 = float2(0.0); Node51_Float_Parameter( Output_N51, Globals );
			float2 Value_N61 = float2(0.0); Node61_Float_Import( Output_N51, Value_N61, Globals );
			float2 Output_N62 = float2(0.0); Node62_Scale_and_Offset( Result_N59, Value_N60, Value_N61, Output_N62, Globals );
			float2 CoordsOut_N63 = float2(0.0); Node63_Scroll_Coords( Output_N62, Value_N61, NF_PORT_CONSTANT( float( 1.0 ), Port_Speed_N063 ), CoordsOut_N63, Globals );
			
			Value1 = CoordsOut_N63;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float2 Result_N59 = float2(0.0); Node59_Switch( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N59, Globals );
			float2 Output_N50 = float2(0.0); Node50_Float_Parameter( Output_N50, Globals );
			float2 Value_N60 = float2(0.0); Node60_Float_Import( Output_N50, Value_N60, Globals );
			float2 Output_N51 = float2(0.0); Node51_Float_Parameter( Output_N51, Globals );
			float2 Value_N61 = float2(0.0); Node61_Float_Import( Output_N51, Value_N61, Globals );
			float2 Output_N62 = float2(0.0); Node62_Scale_and_Offset( Result_N59, Value_N60, Value_N61, Output_N62, Globals );
			
			Default = Output_N62;
		}
		Result = Default;
	}
}
void Node35_If_else( in float Bool1, in float2 Value1, in float2 Default, out float2 Result, ssGlobals Globals )
{ 
	if ( bool( Tweak_N11 ) )
	{
		/* Input port: "Value1"  */
		
		{
			float2 Result_N64 = float2(0.0); Node64_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N64, Globals );
			
			Value1 = Result_N64;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float2 UVCoord_N54 = float2(0.0); Node54_Surface_UV_Coord( UVCoord_N54, Globals );
			
			Default = UVCoord_N54;
		}
		Result = Default;
	}
}
#define Node125_Float_Export( Value, Export, Globals ) Export = Value
#define Node255_Float_Import( Import, Value, Globals ) Value = Import
void Node388_Switch( in float Switch, in float2 Value0, in float2 Value1, in float2 Value2, in float2 Value3, in float2 Default, out float2 Result, ssGlobals Globals )
{ 
	if ( int( NODE_27_DROPLIST_ITEM ) == 0 )
	{
		/* Input port: "Value0"  */
		
		{
			float2 UVCoord_N386 = float2(0.0); Node386_Surface_UV_Coord( UVCoord_N386, Globals );
			
			Value0 = UVCoord_N386;
		}
		Result = Value0;
	}
	else if ( int( NODE_27_DROPLIST_ITEM ) == 1 )
	{
		/* Input port: "Value1"  */
		
		{
			float2 UVCoord_N387 = float2(0.0); Node387_Surface_UV_Coord_1( UVCoord_N387, Globals );
			
			Value1 = UVCoord_N387;
		}
		Result = Value1;
	}
	else if ( int( NODE_27_DROPLIST_ITEM ) == 2 )
	{
		/* Input port: "Value2"  */
		
		{
			float2 Result_N1 = float2(0.0); Node1_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N1, Globals );
			float2 Export_N23 = float2(0.0); Node23_Float_Export( Result_N1, Export_N23, Globals );
			float2 Value_N254 = float2(0.0); Node254_Float_Import( Export_N23, Value_N254, Globals );
			
			Value2 = Value_N254;
		}
		Result = Value2;
	}
	else if ( int( NODE_27_DROPLIST_ITEM ) == 3 )
	{
		/* Input port: "Value3"  */
		
		{
			float2 Result_N35 = float2(0.0); Node35_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N35, Globals );
			float2 Export_N125 = float2(0.0); Node125_Float_Export( Result_N35, Export_N125, Globals );
			float2 Value_N255 = float2(0.0); Node255_Float_Import( Export_N125, Value_N255, Globals );
			
			Value3 = Value_N255;
		}
		Result = Value3;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float2 UVCoord_N386 = float2(0.0); Node386_Surface_UV_Coord( UVCoord_N386, Globals );
			
			Default = UVCoord_N386;
		}
		Result = Default;
	}
}
#define Node389_Texture_2D_Sample( UVCoord, Color, Globals ) Color = SC_SAMPLE_TEX_R(baseTex, UVCoord, 0.0)
void Node369_If_else( in float Bool1, in float4 Value1, in float4 Default, out float4 Result, ssGlobals Globals )
{ 
	if ( bool( Tweak_N121 ) )
	{
		/* Input port: "Value1"  */
		
		{
			Node28_Texture_2D_Object_Parameter( Globals );
			Node199_Texture_Object_2D_Import( Globals );
			float2 Result_N388 = float2(0.0); Node388_Switch( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N388, Globals );
			float4 Color_N389 = float4(0.0); Node389_Texture_2D_Sample( Result_N388, Color_N389, Globals );
			
			Value1 = Color_N389;
		}
		Result = Value1;
	}
	else
	{
		
		Result = Default;
	}
}
#define Node148_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node385_Float_Export( Value, Export, Globals ) Export = Value
#define Node92_Float_Import( Import, Value, Globals ) Value = Import
void Node94_Split_Vector( in float3 Value, out float Value1, out float Value2, out float Value3, ssGlobals Globals )
{ 
	Value1 = Value.r;
	Value2 = Value.g;
	Value3 = Value.b;
}
#define Node98_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * float3(Input1)
void Node86_Color_Parameter( out float3 Output, ssGlobals Globals ) { Output = recolorGreen; }
#define Node90_Float_Import( Import, Value, Globals ) Value = Import
#define Node99_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * float3(Input1)
void Node87_Color_Parameter( out float3 Output, ssGlobals Globals ) { Output = recolorBlue; }
#define Node91_Float_Import( Import, Value, Globals ) Value = Import
#define Node100_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * float3(Input1)
#define Node101_Add( Input0, Input1, Input2, Output, Globals ) Output = Input0 + Input1 + Input2
void Node80_If_else( in float Bool1, in float3 Value1, in float3 Default, out float3 Result, ssGlobals Globals )
{ 
	if ( bool( Tweak_N37 ) )
	{
		/* Input port: "Value1"  */
		
		{
			float3 Output_N85 = float3(0.0); Node85_Color_Parameter( Output_N85, Globals );
			float3 Value_N89 = float3(0.0); Node89_Float_Import( Output_N85, Value_N89, Globals );
			float4 Output_N5 = float4(0.0); Node5_Color_Parameter( Output_N5, Globals );
			float4 Value_N384 = float4(0.0); Node384_Float_Import( Output_N5, Value_N384, Globals );
			float4 Result_N369 = float4(0.0); Node369_If_else( float( 0.0 ), float4( 0.0, 0.0, 0.0, 0.0 ), NF_PORT_CONSTANT( float4( 1.0, 1.0, 1.0, 1.0 ), Port_Default_N369 ), Result_N369, Globals );
			float4 Output_N148 = float4(0.0); Node148_Multiply( Value_N384, Result_N369, Output_N148, Globals );
			float4 Export_N385 = float4(0.0); Node385_Float_Export( Output_N148, Export_N385, Globals );
			float4 Value_N92 = float4(0.0); Node92_Float_Import( Export_N385, Value_N92, Globals );
			float Value1_N94 = 0.0; float Value2_N94 = 0.0; float Value3_N94 = 0.0; Node94_Split_Vector( Value_N92.xyz, Value1_N94, Value2_N94, Value3_N94, Globals );
			float3 Output_N98 = float3(0.0); Node98_Multiply( Value_N89, Value1_N94, Output_N98, Globals );
			float3 Output_N86 = float3(0.0); Node86_Color_Parameter( Output_N86, Globals );
			float3 Value_N90 = float3(0.0); Node90_Float_Import( Output_N86, Value_N90, Globals );
			float3 Output_N99 = float3(0.0); Node99_Multiply( Value_N90, Value2_N94, Output_N99, Globals );
			float3 Output_N87 = float3(0.0); Node87_Color_Parameter( Output_N87, Globals );
			float3 Value_N91 = float3(0.0); Node91_Float_Import( Output_N87, Value_N91, Globals );
			float3 Output_N100 = float3(0.0); Node100_Multiply( Value_N91, Value3_N94, Output_N100, Globals );
			float3 Output_N101 = float3(0.0); Node101_Add( Output_N98, Output_N99, Output_N100, Output_N101, Globals );
			
			Value1 = Output_N101;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float4 Output_N5 = float4(0.0); Node5_Color_Parameter( Output_N5, Globals );
			float4 Value_N384 = float4(0.0); Node384_Float_Import( Output_N5, Value_N384, Globals );
			float4 Result_N369 = float4(0.0); Node369_If_else( float( 0.0 ), float4( 0.0, 0.0, 0.0, 0.0 ), NF_PORT_CONSTANT( float4( 1.0, 1.0, 1.0, 1.0 ), Port_Default_N369 ), Result_N369, Globals );
			float4 Output_N148 = float4(0.0); Node148_Multiply( Value_N384, Result_N369, Output_N148, Globals );
			float4 Export_N385 = float4(0.0); Node385_Float_Export( Output_N148, Export_N385, Globals );
			float4 Value_N92 = float4(0.0); Node92_Float_Import( Export_N385, Value_N92, Globals );
			
			Default = Value_N92.xyz;
		}
		Result = Default;
	}
}
#define Node93_Float_Export( Value, Export, Globals ) Export = Value
#define Node144_Float_Import( Import, Value, Globals ) Value = Import
#define Node73_Construct_Vector( Value1, Value2, Value, Globals ) Value.xyz = Value1; Value.w = Value2
#define Node362_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
void Node363_If_else( in float Bool1, in float4 Value1, in float4 Default, out float4 Result, ssGlobals Globals )
{ 
	if ( bool( ( int( NODE_38_DROPLIST_ITEM ) == int( 1 ) ) ) )
	{
		/* Input port: "Value1"  */
		
		{
			float4 Color_N45 = float4(0.0); Node45_Surface_Color( Color_N45, Globals );
			float3 Result_N80 = float3(0.0); Node80_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), float3( 0.0, 0.0, 0.0 ), Result_N80, Globals );
			float3 Export_N93 = float3(0.0); Node93_Float_Export( Result_N80, Export_N93, Globals );
			float3 Value_N144 = float3(0.0); Node144_Float_Import( Export_N93, Value_N144, Globals );
			float4 Value_N73 = float4(0.0); Node73_Construct_Vector( Value_N144, NF_PORT_CONSTANT( float( 1.0 ), Port_Value2_N073 ), Value_N73, Globals );
			float4 Output_N362 = float4(0.0); Node362_Multiply( Color_N45, Value_N73, Output_N362, Globals );
			
			Value1 = Output_N362;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float3 Result_N80 = float3(0.0); Node80_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), float3( 0.0, 0.0, 0.0 ), Result_N80, Globals );
			float3 Export_N93 = float3(0.0); Node93_Float_Export( Result_N80, Export_N93, Globals );
			float3 Value_N144 = float3(0.0); Node144_Float_Import( Export_N93, Value_N144, Globals );
			float4 Value_N73 = float4(0.0); Node73_Construct_Vector( Value_N144, NF_PORT_CONSTANT( float( 1.0 ), Port_Value2_N073 ), Value_N73, Globals );
			
			Default = Value_N73;
		}
		Result = Default;
	}
}
#define Node364_Float_Export( Value, Export, Globals ) Export = Value
#define Node166_Float_Import( Import, Value, Globals ) Value = Import
#define Node168_Swizzle( Input, Output, Globals ) Output = Input.a
void Node308_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N308 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node206_Float_Import( Import, Value, Globals ) Value = Import
#define Node68_Texture_2D_Object_Parameter( Globals ) /*nothing*/
#define Node40_Texture_Object_2D_Import( Globals ) /*nothing*/
#define Node69_DropList_Parameter( Output, Globals ) Output = float( NODE_69_DROPLIST_ITEM )
#define Node43_Float_Import( Import, Value, Globals ) Value = Import
#define Node48_Surface_UV_Coord( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord0
#define Node137_Surface_UV_Coord_1( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord1
#define Node151_Float_Import( Import, Value, Globals ) Value = Import
#define Node155_Float_Import( Import, Value, Globals ) Value = Import
void Node156_Switch( in float Switch, in float2 Value0, in float2 Value1, in float2 Value2, in float2 Value3, in float2 Default, out float2 Result, ssGlobals Globals )
{ 
	if ( int( NODE_69_DROPLIST_ITEM ) == 0 )
	{
		/* Input port: "Value0"  */
		
		{
			float2 UVCoord_N48 = float2(0.0); Node48_Surface_UV_Coord( UVCoord_N48, Globals );
			
			Value0 = UVCoord_N48;
		}
		Result = Value0;
	}
	else if ( int( NODE_69_DROPLIST_ITEM ) == 1 )
	{
		/* Input port: "Value1"  */
		
		{
			float2 UVCoord_N137 = float2(0.0); Node137_Surface_UV_Coord_1( UVCoord_N137, Globals );
			
			Value1 = UVCoord_N137;
		}
		Result = Value1;
	}
	else if ( int( NODE_69_DROPLIST_ITEM ) == 2 )
	{
		/* Input port: "Value2"  */
		
		{
			float2 Result_N1 = float2(0.0); Node1_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N1, Globals );
			float2 Export_N23 = float2(0.0); Node23_Float_Export( Result_N1, Export_N23, Globals );
			float2 Value_N151 = float2(0.0); Node151_Float_Import( Export_N23, Value_N151, Globals );
			
			Value2 = Value_N151;
		}
		Result = Value2;
	}
	else if ( int( NODE_69_DROPLIST_ITEM ) == 3 )
	{
		/* Input port: "Value3"  */
		
		{
			float2 Result_N35 = float2(0.0); Node35_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N35, Globals );
			float2 Export_N125 = float2(0.0); Node125_Float_Export( Result_N35, Export_N125, Globals );
			float2 Value_N155 = float2(0.0); Node155_Float_Import( Export_N125, Value_N155, Globals );
			
			Value3 = Value_N155;
		}
		Result = Value3;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float2 UVCoord_N48 = float2(0.0); Node48_Surface_UV_Coord( UVCoord_N48, Globals );
			
			Default = UVCoord_N48;
		}
		Result = Default;
	}
}
#define Node157_Texture_2D_Sample( UVCoord, Color, Globals ) Color = SC_SAMPLE_TEX_R(opacityTex, UVCoord, 0.0)
#define Node203_Swizzle( Input, Output, Globals ) Output = Input
void Node204_If_else( in float Bool1, in float Value1, in float Default, out float Result, ssGlobals Globals )
{ 
	if ( bool( Tweak_N308 ) )
	{
		/* Input port: "Value1"  */
		
		{
			Node68_Texture_2D_Object_Parameter( Globals );
			Node40_Texture_Object_2D_Import( Globals );
			float2 Result_N156 = float2(0.0); Node156_Switch( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N156, Globals );
			float4 Color_N157 = float4(0.0); Node157_Texture_2D_Sample( Result_N156, Color_N157, Globals );
			float Output_N203 = 0.0; Node203_Swizzle( Color_N157.x, Output_N203, Globals );
			
			Value1 = Output_N203;
		}
		Result = Value1;
	}
	else
	{
		
		Result = Default;
	}
}
#define Node47_Float_Import( Import, Value, Globals ) Value = Import
#define Node2_Is_Equal( Input0, Input1, Output, Globals ) Output = ssEqual( Input0, Input1 )
#define Node84_Surface_Color( Color, Globals ) Color = Globals.VertexColor
#define Node96_Swizzle( Input, Output, Globals ) Output = Input.a
void Node72_Conditional( in float Input0, in float Input1, in float Input2, out float Output, ssGlobals Globals )
{ 
	#if 0
	/* Input port: "Input0"  */
	
	{
		float Output_N38 = 0.0; Node38_DropList_Parameter( Output_N38, Globals );
		float Value_N47 = 0.0; Node47_Float_Import( Output_N38, Value_N47, Globals );
		float Output_N2 = 0.0; Node2_Is_Equal( Value_N47, NF_PORT_CONSTANT( float( 1.0 ), Port_Input1_N002 ), Output_N2, Globals );
		
		Input0 = Output_N2;
	}
	#endif
	
	if ( bool( ( int( NODE_38_DROPLIST_ITEM ) == int( 1 ) ) ) ) 
	{ 
		/* Input port: "Input1"  */
		
		{
			float4 Color_N84 = float4(0.0); Node84_Surface_Color( Color_N84, Globals );
			float Output_N96 = 0.0; Node96_Swizzle( Color_N84, Output_N96, Globals );
			
			Input1 = Output_N96;
		}
		Output = Input1; 
	} 
	else 
	{ 
		
		Output = Input2; 
	}
}
#define Node205_Multiply( Input0, Input1, Input2, Output, Globals ) Output = Input0 * Input1 * Input2
#define Node158_Float_Export( Value, Export, Globals ) Export = Value
void Node354_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N354 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node336_Float_Import( Import, Value, Globals ) Value = Import
#define Node194_Surface_Tangent( Tangent, Globals ) Tangent = Globals.VertexTangent_WorldSpace
#define Node193_Surface_Bitangent( Binormal, Globals ) Binormal = Globals.VertexBinormal_WorldSpace
#define Node330_Surface_Normal( Normal, Globals ) Normal = Globals.VertexNormal_WorldSpace
#define Node333_Construct_Matrix( Column0, Column1, Column2, Matrix, Globals ) Matrix = mat3( Column0, Column1, Column2 )
float3 ngs_CombineNormals( float3 Normal1, float Strength1, float3 Normal2, float Strength2 )
{
	float3 t = mix( vec3( 0.0, 0.0, 1.0 ), Normal1, Strength1 ) + float3( 0.0, 0.0, 1.0 );
	float3 u = mix( vec3( 0.0, 0.0, 1.0 ), Normal2, Strength2 ) * float3( -1.0, -1.0, 1.0 );
	return normalize( t * dot( t, u ) - u * t.z );
}
#define Node180_Texture_2D_Object_Parameter( Globals ) /*nothing*/
#define Node159_Texture_Object_2D_Import( Globals ) /*nothing*/
#define Node181_DropList_Parameter( Output, Globals ) Output = float( NODE_181_DROPLIST_ITEM )
#define Node160_Float_Import( Import, Value, Globals ) Value = Import
#define Node162_Surface_UV_Coord( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord0
#define Node163_Surface_UV_Coord_1( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord1
#define Node167_Float_Import( Import, Value, Globals ) Value = Import
#define Node207_Float_Import( Import, Value, Globals ) Value = Import
void Node208_Switch( in float Switch, in float2 Value0, in float2 Value1, in float2 Value2, in float2 Value3, in float2 Default, out float2 Result, ssGlobals Globals )
{ 
	if ( int( NODE_181_DROPLIST_ITEM ) == 0 )
	{
		/* Input port: "Value0"  */
		
		{
			float2 UVCoord_N162 = float2(0.0); Node162_Surface_UV_Coord( UVCoord_N162, Globals );
			
			Value0 = UVCoord_N162;
		}
		Result = Value0;
	}
	else if ( int( NODE_181_DROPLIST_ITEM ) == 1 )
	{
		/* Input port: "Value1"  */
		
		{
			float2 UVCoord_N163 = float2(0.0); Node163_Surface_UV_Coord_1( UVCoord_N163, Globals );
			
			Value1 = UVCoord_N163;
		}
		Result = Value1;
	}
	else if ( int( NODE_181_DROPLIST_ITEM ) == 2 )
	{
		/* Input port: "Value2"  */
		
		{
			float2 Result_N1 = float2(0.0); Node1_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N1, Globals );
			float2 Export_N23 = float2(0.0); Node23_Float_Export( Result_N1, Export_N23, Globals );
			float2 Value_N167 = float2(0.0); Node167_Float_Import( Export_N23, Value_N167, Globals );
			
			Value2 = Value_N167;
		}
		Result = Value2;
	}
	else if ( int( NODE_181_DROPLIST_ITEM ) == 3 )
	{
		/* Input port: "Value3"  */
		
		{
			float2 Result_N35 = float2(0.0); Node35_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N35, Globals );
			float2 Export_N125 = float2(0.0); Node125_Float_Export( Result_N35, Export_N125, Globals );
			float2 Value_N207 = float2(0.0); Node207_Float_Import( Export_N125, Value_N207, Globals );
			
			Value3 = Value_N207;
		}
		Result = Value3;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float2 UVCoord_N162 = float2(0.0); Node162_Surface_UV_Coord( UVCoord_N162, Globals );
			
			Default = UVCoord_N162;
		}
		Result = Default;
	}
}
void Node209_Texture_2D_Sample( in float2 UVCoord, out float4 Color, ssGlobals Globals )
{ 
	Color = SC_SAMPLE_TEX_R(normalTex, UVCoord, 0.0);
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	Color.xyz = Color.xyz * ( 255.0 / 128.0 ) - 1.0;
}
void Node218_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N218 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node95_Float_Import( Import, Value, Globals ) Value = Import
#define Node183_Texture_2D_Object_Parameter( Globals ) /*nothing*/
#define Node107_Texture_Object_2D_Import( Globals ) /*nothing*/
#define Node184_DropList_Parameter( Output, Globals ) Output = float( NODE_184_DROPLIST_ITEM )
#define Node108_Float_Import( Import, Value, Globals ) Value = Import
#define Node109_Surface_UV_Coord( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord0
#define Node110_Surface_UV_Coord_1( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord1
void Node111_Switch( in float Switch, in float2 Value0, in float2 Value1, in float2 Value2, in float2 Value3, in float2 Default, out float2 Result, ssGlobals Globals )
{ 
	if ( int( NODE_184_DROPLIST_ITEM ) == 0 )
	{
		/* Input port: "Value0"  */
		
		{
			float2 UVCoord_N109 = float2(0.0); Node109_Surface_UV_Coord( UVCoord_N109, Globals );
			
			Value0 = UVCoord_N109;
		}
		Result = Value0;
	}
	else if ( int( NODE_184_DROPLIST_ITEM ) == 1 )
	{
		/* Input port: "Value1"  */
		
		{
			float2 UVCoord_N110 = float2(0.0); Node110_Surface_UV_Coord_1( UVCoord_N110, Globals );
			
			Value1 = UVCoord_N110;
		}
		Result = Value1;
	}
	else if ( int( NODE_184_DROPLIST_ITEM ) == 2 )
	{
		/* Input port: "Value2"  */
		
		{
			float2 Result_N1 = float2(0.0); Node1_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N1, Globals );
			float2 Export_N23 = float2(0.0); Node23_Float_Export( Result_N1, Export_N23, Globals );
			float2 Value_N167 = float2(0.0); Node167_Float_Import( Export_N23, Value_N167, Globals );
			
			Value2 = Value_N167;
		}
		Result = Value2;
	}
	else if ( int( NODE_184_DROPLIST_ITEM ) == 3 )
	{
		/* Input port: "Value3"  */
		
		{
			float2 Result_N35 = float2(0.0); Node35_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N35, Globals );
			float2 Export_N125 = float2(0.0); Node125_Float_Export( Result_N35, Export_N125, Globals );
			float2 Value_N207 = float2(0.0); Node207_Float_Import( Export_N125, Value_N207, Globals );
			
			Value3 = Value_N207;
		}
		Result = Value3;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float2 UVCoord_N109 = float2(0.0); Node109_Surface_UV_Coord( UVCoord_N109, Globals );
			
			Default = UVCoord_N109;
		}
		Result = Default;
	}
}
void Node112_Texture_2D_Sample( in float2 UVCoord, out float4 Color, ssGlobals Globals )
{ 
	Color = SC_SAMPLE_TEX_R(detailNormalTex, UVCoord, 0.0);
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	Color.xyz = Color.xyz * ( 255.0 / 128.0 ) - 1.0;
}
void Node113_If_else( in float Bool1, in float3 Value1, in float3 Default, out float3 Result, ssGlobals Globals )
{ 
	if ( bool( Tweak_N218 ) )
	{
		/* Input port: "Value1"  */
		
		{
			Node183_Texture_2D_Object_Parameter( Globals );
			Node107_Texture_Object_2D_Import( Globals );
			float2 Result_N111 = float2(0.0); Node111_Switch( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N111, Globals );
			float4 Color_N112 = float4(0.0); Node112_Texture_2D_Sample( Result_N111, Color_N112, Globals );
			
			Value1 = Color_N112.xyz;
		}
		Result = Value1;
	}
	else
	{
		
		Result = Default;
	}
}
void Node200_Combine_Normals( in float3 Normal1, in float Strength1, in float3 Normal2, in float Strength2, out float3 Normal, ssGlobals Globals )
{ 
	Normal2 = ngs_CombineNormals( Normal1, Strength1, Normal2, Strength2 );
	Normal = Normal2;
}
#define Node335_Transform_by_Matrix( Input0, Input1, Output, Globals ) Output = Input0 * Input1
void Node345_Normalize( in float3 Input0, out float3 Output, ssGlobals Globals )
{ 
	float lengthSquared = dot( Input0, Input0 );
	float l = ( lengthSquared > 0.0 ) ? 1.0 / sqrt( lengthSquared  ) : 0.0;
	Output = Input0 * l;
}
void Node346_Normalize( in float3 Input0, out float3 Output, ssGlobals Globals )
{ 
	float lengthSquared = dot( Input0, Input0 );
	float l = ( lengthSquared > 0.0 ) ? 1.0 / sqrt( lengthSquared  ) : 0.0;
	Output = Input0 * l;
}
void Node337_If_else( in float Bool1, in float3 Value1, in float3 Default, out float3 Result, ssGlobals Globals )
{ 
	if ( bool( Tweak_N354 ) )
	{
		/* Input port: "Value1"  */
		
		{
			float3 Tangent_N194 = float3(0.0); Node194_Surface_Tangent( Tangent_N194, Globals );
			float3 Binormal_N193 = float3(0.0); Node193_Surface_Bitangent( Binormal_N193, Globals );
			float3 Normal_N330 = float3(0.0); Node330_Surface_Normal( Normal_N330, Globals );
			mat3 Matrix_N333 = mat3(0.0); Node333_Construct_Matrix( Tangent_N194, Binormal_N193, Normal_N330, Matrix_N333, Globals );
			Node180_Texture_2D_Object_Parameter( Globals );
			Node159_Texture_Object_2D_Import( Globals );
			float2 Result_N208 = float2(0.0); Node208_Switch( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N208, Globals );
			float4 Color_N209 = float4(0.0); Node209_Texture_2D_Sample( Result_N208, Color_N209, Globals );
			float3 Result_N113 = float3(0.0); Node113_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), NF_PORT_CONSTANT( float3( 0.0, 0.0, 1.0 ), Port_Default_N113 ), Result_N113, Globals );
			float3 Normal_N200 = float3(0.0); Node200_Combine_Normals( Color_N209.xyz, NF_PORT_CONSTANT( float( 1.0 ), Port_Strength1_N200 ), Result_N113, NF_PORT_CONSTANT( float( 1.0 ), Port_Strength2_N200 ), Normal_N200, Globals );
			float3 Output_N335 = float3(0.0); Node335_Transform_by_Matrix( Matrix_N333, Normal_N200, Output_N335, Globals );
			float3 Output_N345 = float3(0.0); Node345_Normalize( Output_N335, Output_N345, Globals );
			
			Value1 = Output_N345;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float3 Normal_N330 = float3(0.0); Node330_Surface_Normal( Normal_N330, Globals );
			float3 Output_N346 = float3(0.0); Node346_Normalize( Normal_N330, Output_N346, Globals );
			
			Default = Output_N346;
		}
		Result = Default;
	}
}
#define Node334_Float_Export( Value, Export, Globals ) Export = Value
#define Node273_Float_Import( Import, Value, Globals ) Value = Import
#define Node274_Is_Equal( Input0, Input1, Output, Globals ) Output = ssEqual( Input0, Input1 )
void Node223_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N223 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node131_Float_Import( Import, Value, Globals ) Value = Import
#define Node97_Or( A, B, Result, Globals ) Result = ( ( A * 1.0 != 0.0 ) || ( B * 1.0 != 0.0 ) ) ? 1.0 : 0.0
#define Node275_Surface_Color( Color, Globals ) Color = Globals.VertexColor
#define Node75_Texture_2D_Object_Parameter( Globals ) /*nothing*/
#define Node115_Texture_Object_2D_Import( Globals ) /*nothing*/
#define Node76_DropList_Parameter( Output, Globals ) Output = float( NODE_76_DROPLIST_ITEM )
#define Node116_Float_Import( Import, Value, Globals ) Value = Import
#define Node117_Surface_UV_Coord( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord0
#define Node119_Surface_UV_Coord_1( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord1
#define Node120_Float_Import( Import, Value, Globals ) Value = Import
#define Node127_Float_Import( Import, Value, Globals ) Value = Import
void Node128_Switch( in float Switch, in float2 Value0, in float2 Value1, in float2 Value2, in float2 Value3, in float2 Default, out float2 Result, ssGlobals Globals )
{ 
	if ( int( NODE_76_DROPLIST_ITEM ) == 0 )
	{
		/* Input port: "Value0"  */
		
		{
			float2 UVCoord_N117 = float2(0.0); Node117_Surface_UV_Coord( UVCoord_N117, Globals );
			
			Value0 = UVCoord_N117;
		}
		Result = Value0;
	}
	else if ( int( NODE_76_DROPLIST_ITEM ) == 1 )
	{
		/* Input port: "Value1"  */
		
		{
			float2 UVCoord_N119 = float2(0.0); Node119_Surface_UV_Coord_1( UVCoord_N119, Globals );
			
			Value1 = UVCoord_N119;
		}
		Result = Value1;
	}
	else if ( int( NODE_76_DROPLIST_ITEM ) == 2 )
	{
		/* Input port: "Value2"  */
		
		{
			float2 Result_N1 = float2(0.0); Node1_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N1, Globals );
			float2 Export_N23 = float2(0.0); Node23_Float_Export( Result_N1, Export_N23, Globals );
			float2 Value_N120 = float2(0.0); Node120_Float_Import( Export_N23, Value_N120, Globals );
			
			Value2 = Value_N120;
		}
		Result = Value2;
	}
	else if ( int( NODE_76_DROPLIST_ITEM ) == 3 )
	{
		/* Input port: "Value3"  */
		
		{
			float2 Result_N35 = float2(0.0); Node35_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N35, Globals );
			float2 Export_N125 = float2(0.0); Node125_Float_Export( Result_N35, Export_N125, Globals );
			float2 Value_N127 = float2(0.0); Node127_Float_Import( Export_N125, Value_N127, Globals );
			
			Value3 = Value_N127;
		}
		Result = Value3;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float2 UVCoord_N117 = float2(0.0); Node117_Surface_UV_Coord( UVCoord_N117, Globals );
			
			Default = UVCoord_N117;
		}
		Result = Default;
	}
}
#define Node66_Texture_2D_Sample( UVCoord, Color, Globals ) Color = SC_SAMPLE_TEX_R(emissiveTex, UVCoord, 0.0)
void Node132_If_else( in float Bool1, in float3 Value1, in float3 Default, out float3 Result, ssGlobals Globals )
{ 
	if ( bool( Tweak_N223 ) )
	{
		/* Input port: "Value1"  */
		
		{
			Node75_Texture_2D_Object_Parameter( Globals );
			Node115_Texture_Object_2D_Import( Globals );
			float2 Result_N128 = float2(0.0); Node128_Switch( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N128, Globals );
			float4 Color_N66 = float4(0.0); Node66_Texture_2D_Sample( Result_N128, Color_N66, Globals );
			
			Value1 = Color_N66.xyz;
		}
		Result = Value1;
	}
	else
	{
		
		Result = Default;
	}
}
#define Node293_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
void Node294_If_else( in float Bool1, in float3 Value1, in float3 Default, out float3 Result, ssGlobals Globals )
{ 
	if ( bool( ( int( NODE_38_DROPLIST_ITEM ) == int( 2 ) ) ) )
	{
		/* Input port: "Value1"  */
		
		{
			float4 Color_N275 = float4(0.0); Node275_Surface_Color( Color_N275, Globals );
			float3 Result_N132 = float3(0.0); Node132_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), NF_PORT_CONSTANT( float3( 0.0, 0.0, 0.0 ), Port_Default_N132 ), Result_N132, Globals );
			float3 Output_N293 = float3(0.0); Node293_Add( Color_N275.xyz, Result_N132, Output_N293, Globals );
			
			Value1 = Output_N293;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float3 Result_N132 = float3(0.0); Node132_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), NF_PORT_CONSTANT( float3( 0.0, 0.0, 0.0 ), Port_Default_N132 ), Result_N132, Globals );
			
			Default = Result_N132;
		}
		Result = Default;
	}
}
void Node236_Color_Parameter( out float3 Output, ssGlobals Globals ) { Output = emissiveColor; }
#define Node295_Float_Import( Import, Value, Globals ) Value = Import
void Node233_Float_Parameter( out float Output, ssGlobals Globals ) { Output = emissiveIntensity; }
#define Node296_Float_Import( Import, Value, Globals ) Value = Import
#define Node297_Multiply( Input0, Input1, Input2, Output, Globals ) Output = Input0 * Input1 * float3(Input2)
#define Node82_SRGB_to_Linear( Input0, Output, Globals ) Output = ssSRGB_to_Linear( Input0 )
void Node103_If_else( in float Bool1, in float3 Value1, in float3 Default, out float3 Result, ssGlobals Globals )
{ 
	if ( bool( ( bool( ( int( NODE_38_DROPLIST_ITEM ) == int( 2 ) ) ) || bool( Tweak_N223 ) ) ) )
	{
		/* Input port: "Value1"  */
		
		{
			float3 Result_N294 = float3(0.0); Node294_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), float3( 0.0, 0.0, 0.0 ), Result_N294, Globals );
			float3 Output_N236 = float3(0.0); Node236_Color_Parameter( Output_N236, Globals );
			float3 Value_N295 = float3(0.0); Node295_Float_Import( Output_N236, Value_N295, Globals );
			float Output_N233 = 0.0; Node233_Float_Parameter( Output_N233, Globals );
			float Value_N296 = 0.0; Node296_Float_Import( Output_N233, Value_N296, Globals );
			float3 Output_N297 = float3(0.0); Node297_Multiply( Result_N294, Value_N295, Value_N296, Output_N297, Globals );
			float3 Output_N82 = float3(0.0); Node82_SRGB_to_Linear( Output_N297, Output_N82, Globals );
			
			Value1 = Output_N82;
		}
		Result = Value1;
	}
	else
	{
		
		Result = Default;
	}
}
void Node179_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N179 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node133_Float_Import( Import, Value, Globals ) Value = Import
void Node225_Float_Parameter( out float Output, ssGlobals Globals ) { Output = reflectionIntensity; }
#define Node231_Float_Import( Import, Value, Globals ) Value = Import
#define Node226_Texture_2D_Object_Parameter( Globals ) /*nothing*/
#define Node249_Texture_Object_2D_Import( Globals ) /*nothing*/
#define Node352_View_Vector( ViewVector, Globals ) ViewVector = Globals.ViewDirWS
#define Node327_Float_Import( Import, Value, Globals ) Value = Import
#define Node256_Reflect( Input0, Input1, Output, Globals ) Output = reflect( Input0, Input1 )
#define Node257_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node259_Float_Import( Import, Value, Globals ) Value = Import
#define Node260_Swizzle( Input, Output, Globals ) Output = float2( Input.x, Input.y )
void Node261_Split_Vector( in float3 Value, out float Value1, out float Value2, out float Value3, ssGlobals Globals )
{ 
	Value1 = Value.x;
	Value2 = Value.y;
	Value3 = Value.z;
}
#define Node262_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node263_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node264_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
#define Node265_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node266_Add( Input0, Input1, Input2, Output, Globals ) Output = Input0 + Input1 + Input2
#define Node267_Sqrt( Input0, Output, Globals ) Output = ( Input0 <= 0.0 ) ? 0.0 : sqrt( Input0 )
#define Node268_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node269_Divide( Input0, Input1, Output, Globals ) Output = Input0 / float2(Input1)
#define Node270_Add( Input0, Input1, Output, Globals ) Output = Input0 + float2(Input1)
#define Node77_One_Minus( Input0, Output, Globals ) Output = 1.0 - Input0
#define Node250_Float_Export( Value, Export, Globals ) Export = Value
#define Node252_Texture_2D_Sample( UVCoord, Color, Globals ) Color = SC_SAMPLE_TEX_R(reflectionTex, UVCoord, 0.0)
void Node177_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N177 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node123_Float_Import( Import, Value, Globals ) Value = Import
#define Node227_Texture_2D_Object_Parameter( Globals ) /*nothing*/
#define Node24_Texture_Object_2D_Import( Globals ) /*nothing*/
#define Node228_DropList_Parameter( Output, Globals ) Output = float( NODE_228_DROPLIST_ITEM )
#define Node25_Float_Import( Import, Value, Globals ) Value = Import
#define Node26_Surface_UV_Coord( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord0
#define Node29_Surface_UV_Coord_1( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord1
#define Node30_Float_Import( Import, Value, Globals ) Value = Import
#define Node31_Float_Import( Import, Value, Globals ) Value = Import
void Node32_Switch( in float Switch, in float2 Value0, in float2 Value1, in float2 Value2, in float2 Value3, in float2 Default, out float2 Result, ssGlobals Globals )
{ 
	if ( int( NODE_228_DROPLIST_ITEM ) == 0 )
	{
		/* Input port: "Value0"  */
		
		{
			float2 UVCoord_N26 = float2(0.0); Node26_Surface_UV_Coord( UVCoord_N26, Globals );
			
			Value0 = UVCoord_N26;
		}
		Result = Value0;
	}
	else if ( int( NODE_228_DROPLIST_ITEM ) == 1 )
	{
		/* Input port: "Value1"  */
		
		{
			float2 UVCoord_N29 = float2(0.0); Node29_Surface_UV_Coord_1( UVCoord_N29, Globals );
			
			Value1 = UVCoord_N29;
		}
		Result = Value1;
	}
	else if ( int( NODE_228_DROPLIST_ITEM ) == 2 )
	{
		/* Input port: "Value2"  */
		
		{
			float2 Result_N1 = float2(0.0); Node1_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N1, Globals );
			float2 Export_N23 = float2(0.0); Node23_Float_Export( Result_N1, Export_N23, Globals );
			float2 Value_N30 = float2(0.0); Node30_Float_Import( Export_N23, Value_N30, Globals );
			
			Value2 = Value_N30;
		}
		Result = Value2;
	}
	else if ( int( NODE_228_DROPLIST_ITEM ) == 3 )
	{
		/* Input port: "Value3"  */
		
		{
			float2 Result_N35 = float2(0.0); Node35_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N35, Globals );
			float2 Export_N125 = float2(0.0); Node125_Float_Export( Result_N35, Export_N125, Globals );
			float2 Value_N31 = float2(0.0); Node31_Float_Import( Export_N125, Value_N31, Globals );
			
			Value3 = Value_N31;
		}
		Result = Value3;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float2 UVCoord_N26 = float2(0.0); Node26_Surface_UV_Coord( UVCoord_N26, Globals );
			
			Default = UVCoord_N26;
		}
		Result = Default;
	}
}
#define Node33_Texture_2D_Sample( UVCoord, Color, Globals ) Color = SC_SAMPLE_TEX_R(reflectionModulationTex, UVCoord, 0.0)
void Node41_If_else( in float Bool1, in float3 Value1, in float3 Default, out float3 Result, ssGlobals Globals )
{ 
	if ( bool( Tweak_N177 ) )
	{
		/* Input port: "Value1"  */
		
		{
			Node227_Texture_2D_Object_Parameter( Globals );
			Node24_Texture_Object_2D_Import( Globals );
			float2 Result_N32 = float2(0.0); Node32_Switch( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N32, Globals );
			float4 Color_N33 = float4(0.0); Node33_Texture_2D_Sample( Result_N32, Color_N33, Globals );
			
			Value1 = Color_N33.xyz;
		}
		Result = Value1;
	}
	else
	{
		
		Result = Default;
	}
}
#define Node253_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node341_SRGB_to_Linear( Input0, Output, Globals ) Output = ssSRGB_to_Linear( Input0 )
#define Node271_Multiply( Input0, Input1, Output, Globals ) Output = float3(Input0) * Input1
void Node134_If_else( in float Bool1, in float3 Value1, in float3 Default, out float3 Result, ssGlobals Globals )
{ 
	if ( bool( Tweak_N179 ) )
	{
		/* Input port: "Value1"  */
		
		{
			float Output_N225 = 0.0; Node225_Float_Parameter( Output_N225, Globals );
			float Value_N231 = 0.0; Node231_Float_Import( Output_N225, Value_N231, Globals );
			Node226_Texture_2D_Object_Parameter( Globals );
			Node249_Texture_Object_2D_Import( Globals );
			float3 ViewVector_N352 = float3(0.0); Node352_View_Vector( ViewVector_N352, Globals );
			float3 Result_N337 = float3(0.0); Node337_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), float3( 0.0, 0.0, 0.0 ), Result_N337, Globals );
			float3 Export_N334 = float3(0.0); Node334_Float_Export( Result_N337, Export_N334, Globals );
			float3 Value_N327 = float3(0.0); Node327_Float_Import( Export_N334, Value_N327, Globals );
			float3 Output_N256 = float3(0.0); Node256_Reflect( ViewVector_N352, Value_N327, Output_N256, Globals );
			float3 Output_N257 = float3(0.0); Node257_Multiply( Output_N256, NF_PORT_CONSTANT( float3( 1.0, 1.0, -1.0 ), Port_Input1_N257 ), Output_N257, Globals );
			float3 Value_N259 = float3(0.0); Node259_Float_Import( Output_N257, Value_N259, Globals );
			float2 Output_N260 = float2(0.0); Node260_Swizzle( Value_N259.xy, Output_N260, Globals );
			float Value1_N261 = 0.0; float Value2_N261 = 0.0; float Value3_N261 = 0.0; Node261_Split_Vector( Value_N259, Value1_N261, Value2_N261, Value3_N261, Globals );
			float Output_N262 = 0.0; Node262_Multiply( Value1_N261, Value1_N261, Output_N262, Globals );
			float Output_N263 = 0.0; Node263_Multiply( Value2_N261, Value2_N261, Output_N263, Globals );
			float Output_N264 = 0.0; Node264_Add( Value3_N261, NF_PORT_CONSTANT( float( 1.0 ), Port_Input1_N264 ), Output_N264, Globals );
			float Output_N265 = 0.0; Node265_Multiply( Output_N264, Output_N264, Output_N265, Globals );
			float Output_N266 = 0.0; Node266_Add( Output_N262, Output_N263, Output_N265, Output_N266, Globals );
			float Output_N267 = 0.0; Node267_Sqrt( Output_N266, Output_N267, Globals );
			float Output_N268 = 0.0; Node268_Multiply( Output_N267, NF_PORT_CONSTANT( float( 2.0 ), Port_Input1_N268 ), Output_N268, Globals );
			float2 Output_N269 = float2(0.0); Node269_Divide( Output_N260, Output_N268, Output_N269, Globals );
			float2 Output_N270 = float2(0.0); Node270_Add( Output_N269, NF_PORT_CONSTANT( float( 0.5 ), Port_Input1_N270 ), Output_N270, Globals );
			float2 Output_N77 = float2(0.0); Node77_One_Minus( Output_N270, Output_N77, Globals );
			float2 Export_N250 = float2(0.0); Node250_Float_Export( Output_N77, Export_N250, Globals );
			float4 Color_N252 = float4(0.0); Node252_Texture_2D_Sample( Export_N250, Color_N252, Globals );
			float3 Result_N41 = float3(0.0); Node41_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Default_N041 ), Result_N41, Globals );
			float3 Output_N253 = float3(0.0); Node253_Multiply( Color_N252.xyz, Result_N41, Output_N253, Globals );
			float3 Output_N341 = float3(0.0); Node341_SRGB_to_Linear( Output_N253, Output_N341, Globals );
			float3 Output_N271 = float3(0.0); Node271_Multiply( Value_N231, Output_N341, Output_N271, Globals );
			
			Value1 = Output_N271;
		}
		Result = Value1;
	}
	else
	{
		
		Result = Default;
	}
}
#define Node303_Float_Export( Value, Export, Globals ) Export = Value
#define Node298_Float_Import( Import, Value, Globals ) Value = Import
void Node74_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N74 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node172_Float_Import( Import, Value, Globals ) Value = Import
void Node309_Color_Parameter( out float3 Output, ssGlobals Globals ) { Output = rimColor; }
#define Node318_Float_Import( Import, Value, Globals ) Value = Import
void Node310_Float_Parameter( out float Output, ssGlobals Globals ) { Output = rimIntensity; }
#define Node319_Float_Import( Import, Value, Globals ) Value = Import
void Node216_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N216 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node171_Float_Import( Import, Value, Globals ) Value = Import
#define Node314_Texture_2D_Object_Parameter( Globals ) /*nothing*/
#define Node102_Texture_Object_2D_Import( Globals ) /*nothing*/
#define Node315_DropList_Parameter( Output, Globals ) Output = float( NODE_315_DROPLIST_ITEM )
#define Node135_Float_Import( Import, Value, Globals ) Value = Import
#define Node136_Surface_UV_Coord( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord0
#define Node140_Surface_UV_Coord_1( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord1
#define Node150_Float_Import( Import, Value, Globals ) Value = Import
#define Node152_Float_Import( Import, Value, Globals ) Value = Import
void Node154_Switch( in float Switch, in float2 Value0, in float2 Value1, in float2 Value2, in float2 Value3, in float2 Default, out float2 Result, ssGlobals Globals )
{ 
	if ( int( NODE_315_DROPLIST_ITEM ) == 0 )
	{
		/* Input port: "Value0"  */
		
		{
			float2 UVCoord_N136 = float2(0.0); Node136_Surface_UV_Coord( UVCoord_N136, Globals );
			
			Value0 = UVCoord_N136;
		}
		Result = Value0;
	}
	else if ( int( NODE_315_DROPLIST_ITEM ) == 1 )
	{
		/* Input port: "Value1"  */
		
		{
			float2 UVCoord_N140 = float2(0.0); Node140_Surface_UV_Coord_1( UVCoord_N140, Globals );
			
			Value1 = UVCoord_N140;
		}
		Result = Value1;
	}
	else if ( int( NODE_315_DROPLIST_ITEM ) == 2 )
	{
		/* Input port: "Value2"  */
		
		{
			float2 Result_N1 = float2(0.0); Node1_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N1, Globals );
			float2 Export_N23 = float2(0.0); Node23_Float_Export( Result_N1, Export_N23, Globals );
			float2 Value_N150 = float2(0.0); Node150_Float_Import( Export_N23, Value_N150, Globals );
			
			Value2 = Value_N150;
		}
		Result = Value2;
	}
	else if ( int( NODE_315_DROPLIST_ITEM ) == 3 )
	{
		/* Input port: "Value3"  */
		
		{
			float2 Result_N35 = float2(0.0); Node35_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N35, Globals );
			float2 Export_N125 = float2(0.0); Node125_Float_Export( Result_N35, Export_N125, Globals );
			float2 Value_N152 = float2(0.0); Node152_Float_Import( Export_N125, Value_N152, Globals );
			
			Value3 = Value_N152;
		}
		Result = Value3;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float2 UVCoord_N136 = float2(0.0); Node136_Surface_UV_Coord( UVCoord_N136, Globals );
			
			Default = UVCoord_N136;
		}
		Result = Default;
	}
}
#define Node169_Texture_2D_Sample( UVCoord, Color, Globals ) Color = SC_SAMPLE_TEX_R(rimColorTex, UVCoord, 0.0)
void Node170_If_else( in float Bool1, in float3 Value1, in float3 Default, out float3 Result, ssGlobals Globals )
{ 
	if ( bool( Tweak_N216 ) )
	{
		/* Input port: "Value1"  */
		
		{
			Node314_Texture_2D_Object_Parameter( Globals );
			Node102_Texture_Object_2D_Import( Globals );
			float2 Result_N154 = float2(0.0); Node154_Switch( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N154, Globals );
			float4 Color_N169 = float4(0.0); Node169_Texture_2D_Sample( Result_N154, Color_N169, Globals );
			
			Value1 = Color_N169.xyz;
		}
		Result = Value1;
	}
	else
	{
		
		Result = Default;
	}
}
#define Node320_Multiply( Input0, Input1, Input2, Output, Globals ) Output = Input0 * float3(Input1) * Input2
#define Node81_SRGB_to_Linear( Input0, Output, Globals ) Output = ssSRGB_to_Linear( Input0 )
void Node312_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( rimInvert )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node339_Float_Import( Import, Value, Globals ) Value = Import
#define Node328_Float_Import( Import, Value, Globals ) Value = Import
#define Node70_View_Vector( ViewVector, Globals ) ViewVector = -Globals.ViewDirWS
#define Node383_Dot_Product( Input0, Input1, Output, Globals ) Output = dot( Input0, Input1 )
#define Node355_Abs( Input0, Output, Globals ) Output = abs( Input0 )
#define Node342_One_Minus( Input0, Output, Globals ) Output = 1.0 - Input0
void Node343_If_else( in float Bool1, in float Value1, in float Default, out float Result, ssGlobals Globals )
{ 
	if ( bool( rimInvert ) )
	{
		/* Input port: "Value1"  */
		
		{
			float3 Result_N337 = float3(0.0); Node337_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), float3( 0.0, 0.0, 0.0 ), Result_N337, Globals );
			float3 Export_N334 = float3(0.0); Node334_Float_Export( Result_N337, Export_N334, Globals );
			float3 Value_N328 = float3(0.0); Node328_Float_Import( Export_N334, Value_N328, Globals );
			float3 ViewVector_N70 = float3(0.0); Node70_View_Vector( ViewVector_N70, Globals );
			float Output_N383 = 0.0; Node383_Dot_Product( Value_N328, ViewVector_N70, Output_N383, Globals );
			float Output_N355 = 0.0; Node355_Abs( Output_N383, Output_N355, Globals );
			
			Value1 = Output_N355;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float3 Result_N337 = float3(0.0); Node337_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), float3( 0.0, 0.0, 0.0 ), Result_N337, Globals );
			float3 Export_N334 = float3(0.0); Node334_Float_Export( Result_N337, Export_N334, Globals );
			float3 Value_N328 = float3(0.0); Node328_Float_Import( Export_N334, Value_N328, Globals );
			float3 ViewVector_N70 = float3(0.0); Node70_View_Vector( ViewVector_N70, Globals );
			float Output_N383 = 0.0; Node383_Dot_Product( Value_N328, ViewVector_N70, Output_N383, Globals );
			float Output_N355 = 0.0; Node355_Abs( Output_N383, Output_N355, Globals );
			float Output_N342 = 0.0; Node342_One_Minus( Output_N355, Output_N342, Globals );
			
			Default = Output_N342;
		}
		Result = Default;
	}
}
void Node311_Float_Parameter( out float Output, ssGlobals Globals ) { Output = rimExponent; }
#define Node340_Float_Import( Import, Value, Globals ) Value = Import
#define Node329_Pow( Input0, Input1, Output, Globals ) Output = ( Input0 <= 0.0 ) ? 0.0 : pow( Input0, Input1 )
#define Node338_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * float3(Input1)
void Node173_If_else( in float Bool1, in float3 Value1, in float3 Default, out float3 Result, ssGlobals Globals )
{ 
	if ( bool( Tweak_N74 ) )
	{
		/* Input port: "Value1"  */
		
		{
			float3 Output_N309 = float3(0.0); Node309_Color_Parameter( Output_N309, Globals );
			float3 Value_N318 = float3(0.0); Node318_Float_Import( Output_N309, Value_N318, Globals );
			float Output_N310 = 0.0; Node310_Float_Parameter( Output_N310, Globals );
			float Value_N319 = 0.0; Node319_Float_Import( Output_N310, Value_N319, Globals );
			float3 Result_N170 = float3(0.0); Node170_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Default_N170 ), Result_N170, Globals );
			float3 Output_N320 = float3(0.0); Node320_Multiply( Value_N318, Value_N319, Result_N170, Output_N320, Globals );
			float3 Output_N81 = float3(0.0); Node81_SRGB_to_Linear( Output_N320, Output_N81, Globals );
			float Result_N343 = 0.0; Node343_If_else( float( 0.0 ), float( 0.0 ), float( 0.0 ), Result_N343, Globals );
			float Output_N311 = 0.0; Node311_Float_Parameter( Output_N311, Globals );
			float Value_N340 = 0.0; Node340_Float_Import( Output_N311, Value_N340, Globals );
			float Output_N329 = 0.0; Node329_Pow( Result_N343, Value_N340, Output_N329, Globals );
			float3 Output_N338 = float3(0.0); Node338_Multiply( Output_N81, Output_N329, Output_N338, Globals );
			
			Value1 = Output_N338;
		}
		Result = Value1;
	}
	else
	{
		
		Result = Default;
	}
}
#define Node347_Float_Export( Value, Export, Globals ) Export = Value
#define Node306_Float_Import( Import, Value, Globals ) Value = Import
#define Node299_Add( Input0, Input1, Input2, Output, Globals ) Output = Input0 + Input1 + Input2
#define Node251_Linear_to_sRGB( Input0, Output, Globals ) Output = ssLinear_to_SRGB( Input0 )
#define Node300_Float_Export( Value, Export, Globals ) Export = Value
void Node242_Float_Parameter( out float Output, ssGlobals Globals ) { Output = metallic; }
#define Node277_Float_Import( Import, Value, Globals ) Value = Import
#define Node220_Texture_2D_Object_Parameter( Globals ) /*nothing*/
#define Node279_Texture_Object_2D_Import( Globals ) /*nothing*/
#define Node221_DropList_Parameter( Output, Globals ) Output = float( NODE_221_DROPLIST_ITEM )
#define Node280_Float_Import( Import, Value, Globals ) Value = Import
#define Node174_Surface_UV_Coord( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord0
#define Node175_Surface_UV_Coord_1( UVCoord, Globals ) UVCoord = Globals.Surface_UVCoord1
#define Node241_Float_Import( Import, Value, Globals ) Value = Import
#define Node246_Float_Import( Import, Value, Globals ) Value = Import
void Node176_Switch( in float Switch, in float2 Value0, in float2 Value1, in float2 Value2, in float2 Value3, in float2 Default, out float2 Result, ssGlobals Globals )
{ 
	if ( int( NODE_221_DROPLIST_ITEM ) == 0 )
	{
		/* Input port: "Value0"  */
		
		{
			float2 UVCoord_N174 = float2(0.0); Node174_Surface_UV_Coord( UVCoord_N174, Globals );
			
			Value0 = UVCoord_N174;
		}
		Result = Value0;
	}
	else if ( int( NODE_221_DROPLIST_ITEM ) == 1 )
	{
		/* Input port: "Value1"  */
		
		{
			float2 UVCoord_N175 = float2(0.0); Node175_Surface_UV_Coord_1( UVCoord_N175, Globals );
			
			Value1 = UVCoord_N175;
		}
		Result = Value1;
	}
	else if ( int( NODE_221_DROPLIST_ITEM ) == 2 )
	{
		/* Input port: "Value2"  */
		
		{
			float2 Result_N1 = float2(0.0); Node1_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N1, Globals );
			float2 Export_N23 = float2(0.0); Node23_Float_Export( Result_N1, Export_N23, Globals );
			float2 Value_N241 = float2(0.0); Node241_Float_Import( Export_N23, Value_N241, Globals );
			
			Value2 = Value_N241;
		}
		Result = Value2;
	}
	else if ( int( NODE_221_DROPLIST_ITEM ) == 3 )
	{
		/* Input port: "Value3"  */
		
		{
			float2 Result_N35 = float2(0.0); Node35_If_else( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N35, Globals );
			float2 Export_N125 = float2(0.0); Node125_Float_Export( Result_N35, Export_N125, Globals );
			float2 Value_N246 = float2(0.0); Node246_Float_Import( Export_N125, Value_N246, Globals );
			
			Value3 = Value_N246;
		}
		Result = Value3;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float2 UVCoord_N174 = float2(0.0); Node174_Surface_UV_Coord( UVCoord_N174, Globals );
			
			Default = UVCoord_N174;
		}
		Result = Default;
	}
}
#define Node178_Texture_2D_Sample( UVCoord, Color, Globals ) Color = SC_SAMPLE_TEX_R(materialParamsTex, UVCoord, 0.0)
void Node304_Split_Vector( in float2 Value, out float Value1, out float Value2, ssGlobals Globals )
{ 
	Value1 = Value.r;
	Value2 = Value.g;
}
#define Node317_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node222_Float_Export( Value, Export, Globals ) Export = Value
void Node243_Float_Parameter( out float Output, ssGlobals Globals ) { Output = roughness; }
#define Node278_Float_Import( Import, Value, Globals ) Value = Import
#define Node313_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node224_Float_Export( Value, Export, Globals ) Export = Value
#define Node186_Float_Import( Import, Value, Globals ) Value = Import
#define Node187_Is_Equal( Input0, Input1, Output, Globals ) Output = ssEqual( Input0, Input1 )
#define Node190_Surface_Color( Color, Globals ) Color = Globals.VertexColor
#define Node321_Swizzle( Input, Output, Globals ) Output = float3( Input.b, Input.b, Input.b )
#define Node189_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
void Node188_If_else( in float Bool1, in float3 Value1, in float3 Default, out float3 Result, ssGlobals Globals )
{ 
	if ( bool( ( int( NODE_38_DROPLIST_ITEM ) == int( 3 ) ) ) )
	{
		/* Input port: "Value1"  */
		
		{
			float4 Color_N190 = float4(0.0); Node190_Surface_Color( Color_N190, Globals );
			Node220_Texture_2D_Object_Parameter( Globals );
			Node279_Texture_Object_2D_Import( Globals );
			float2 Result_N176 = float2(0.0); Node176_Switch( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N176, Globals );
			float4 Color_N178 = float4(0.0); Node178_Texture_2D_Sample( Result_N176, Color_N178, Globals );
			float3 Output_N321 = float3(0.0); Node321_Swizzle( Color_N178.xyz, Output_N321, Globals );
			float3 Output_N189 = float3(0.0); Node189_Multiply( Color_N190.xyz, Output_N321, Output_N189, Globals );
			
			Value1 = Output_N189;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			Node220_Texture_2D_Object_Parameter( Globals );
			Node279_Texture_Object_2D_Import( Globals );
			float2 Result_N176 = float2(0.0); Node176_Switch( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N176, Globals );
			float4 Color_N178 = float4(0.0); Node178_Texture_2D_Sample( Result_N176, Color_N178, Globals );
			float3 Output_N321 = float3(0.0); Node321_Swizzle( Color_N178.xyz, Output_N321, Globals );
			
			Default = Output_N321;
		}
		Result = Default;
	}
}
#define Node230_Float_Export( Value, Export, Globals ) Export = Value
#define Node78_Float_Import( Import, Value, Globals ) Value = Import
void Node219_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N219 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node281_Float_Import( Import, Value, Globals ) Value = Import
void Node245_Float_Parameter( out float Output, ssGlobals Globals ) { Output = specularAoDarkening; }
#define Node283_Float_Import( Import, Value, Globals ) Value = Import
#define Node324_One_Minus( Input0, Output, Globals ) Output = 1.0 - Input0
#define Node235_Float_Import( Import, Value, Globals ) Value = Import
#define Node234_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * float3(Input1)
#define Node239_Mix( Input0, Input1, Input2, Output, Globals ) Output = mix( Input0, Input1, float3(Input2) )
#define Node323_Multiply( Input0, Input1, Input2, Output, Globals ) Output = float3(Input0) * Input1 * Input2
#define Node322_Mix( Input0, Input1, Input2, Output, Globals ) Output = mix( Input0, Input1, Input2 )
void Node244_Float_Parameter( out float Output, ssGlobals Globals ) { Output = specularAoIntensity; }
#define Node282_Float_Import( Import, Value, Globals ) Value = Import
#define Node325_Mix( Input0, Input1, Input2, Output, Globals ) Output = mix( Input0, Input1, float3(Input2) )
void Node326_If_else( in float Bool1, in float3 Value1, in float3 Default, out float3 Result, ssGlobals Globals )
{ 
	if ( bool( Tweak_N219 ) )
	{
		/* Input port: "Value1"  */
		
		{
			float Output_N245 = 0.0; Node245_Float_Parameter( Output_N245, Globals );
			float Value_N283 = 0.0; Node283_Float_Import( Output_N245, Value_N283, Globals );
			float Output_N324 = 0.0; Node324_One_Minus( Value_N283, Output_N324, Globals );
			float3 Value_N235 = float3(0.0); Node235_Float_Import( NF_PORT_CONSTANT( float3( 0.0, 0.0, 0.0 ), Port_Import_N235 ), Value_N235, Globals );
			float Output_N242 = 0.0; Node242_Float_Parameter( Output_N242, Globals );
			float Value_N277 = 0.0; Node277_Float_Import( Output_N242, Value_N277, Globals );
			Node220_Texture_2D_Object_Parameter( Globals );
			Node279_Texture_Object_2D_Import( Globals );
			float2 Result_N176 = float2(0.0); Node176_Switch( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N176, Globals );
			float4 Color_N178 = float4(0.0); Node178_Texture_2D_Sample( Result_N176, Color_N178, Globals );
			float Value1_N304 = 0.0; float Value2_N304 = 0.0; Node304_Split_Vector( Color_N178.xy, Value1_N304, Value2_N304, Globals );
			float Output_N317 = 0.0; Node317_Multiply( Value_N277, Value1_N304, Output_N317, Globals );
			float3 Output_N234 = float3(0.0); Node234_Multiply( Value_N235, Output_N317, Output_N234, Globals );
			float3 Output_N239 = float3(0.0); Node239_Mix( NF_PORT_CONSTANT( float3( 0.04, 0.04, 0.04 ), Port_Input0_N239 ), Output_N234, Output_N317, Output_N239, Globals );
			float3 Output_N323 = float3(0.0); Node323_Multiply( Output_N324, Output_N239, Output_N239, Output_N323, Globals );
			float3 Result_N188 = float3(0.0); Node188_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), float3( 0.0, 0.0, 0.0 ), Result_N188, Globals );
			float3 Output_N322 = float3(0.0); Node322_Mix( Output_N323, NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Input1_N322 ), Result_N188, Output_N322, Globals );
			float Output_N244 = 0.0; Node244_Float_Parameter( Output_N244, Globals );
			float Value_N282 = 0.0; Node282_Float_Import( Output_N244, Value_N282, Globals );
			float3 Output_N325 = float3(0.0); Node325_Mix( NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Input0_N325 ), Output_N322, Value_N282, Output_N325, Globals );
			
			Value1 = Output_N325;
		}
		Result = Value1;
	}
	else
	{
		
		Result = Default;
	}
}
void Node79_If_else( in float Bool1, in float3 Value1, in float3 Default, out float3 Result, ssGlobals Globals )
{ 
	if ( bool( Tweak_N179 ) )
	{
		
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float3 Result_N326 = float3(0.0); Node326_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), NF_PORT_CONSTANT( float3( 1.0, 0.999969, 0.999985 ), Port_Default_N326 ), Result_N326, Globals );
			
			Default = Result_N326;
		}
		Result = Default;
	}
}
#define Node232_Float_Export( Value, Export, Globals ) Export = Value
void Node36_PBR_Lighting( in float3 Albedo, in float Opacity, in float3 Normal, in float3 Emissive, in float Metallic, in float Roughness, in float3 AO, in float3 SpecularAO, out float4 Output, ssGlobals Globals )
{ 
	if ( !sc_ProjectiveShadowsCaster )
	{
		Globals.BumpedNormal = Normal;
	}
	
	
	Opacity = clamp( Opacity, 0.0, 1.0 ); 		
	
	ngsAlphaTest( Opacity );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	#if SC_RT_RECEIVER_MODE
	sc_WriteReceiverData( Globals.PositionWS, Globals.BumpedNormal, Roughness );
	#else 
	
	
	Albedo = max( Albedo, 0.0 );	
	
	if ( sc_ProjectiveShadowsCaster )
	{
		Output = float4( Albedo, Opacity );
	}
	else
	{
		Emissive = max( Emissive, 0.0 );	
		
		Metallic = clamp( Metallic, 0.0, 1.0 );
		
		Roughness = clamp( Roughness, 0.0, 1.0 );	
		
		AO = clamp( AO, vec3( 0.0 ), vec3( 1.0 ) );		
		
		SpecularAO = clamp( SpecularAO, vec3( 0.0 ), vec3( 1.0 ) );
		Output = ngsCalculateLighting( Albedo, Opacity, Globals.BumpedNormal, Globals.PositionWS, Globals.ViewDirWS, Emissive, Metallic, Roughness, AO, SpecularAO );
	}			
	
	Output = max( Output, 0.0 );
	
	#endif //#if SC_RT_RECEIVER_MODE
}
//-----------------------------------------------------------------------------

void main() 
{
	if (bool(sc_DepthOnly)) {
		return;
	}
	
	
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	#if !SC_RT_RECEIVER_MODE
	sc_DiscardStereoFragment();
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	NF_SETUP_PREVIEW_PIXEL()
	#endif
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	float4 FinalColor = float4( 1.0, 1.0, 1.0, 1.0 );
	
	
	
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	ssGlobals Globals;	
	Globals.gTimeElapsed = sc_TimeElapsed;
	Globals.gTimeDelta   = sc_TimeDelta;
	
	
	#if defined(SC_ENABLE_RT_CASTER) && !SC_RT_RECEIVER_MODE
	if (bool(sc_ProxyMode)) {
		RayHitPayload rhp = GetRayTracingHitData();
		
		if (bool(sc_NoEarlyZ)) {
			if (rhp.id.x != uint(instance_id)) {
				return;
			}
		}
		
		Globals.BumpedNormal               = float3( 0.0 );
		Globals.ViewDirWS                  = rhp.viewDirWS;
		Globals.PositionWS                 = rhp.positionWS;
		Globals.VertexColor                = rhp.color;
		Globals.Surface_UVCoord0           = rhp.uv0;
		Globals.Surface_UVCoord1           = rhp.uv1;
		
		float4                             emitterPositionCS = ngsViewProjectionMatrix * float4( rhp.positionWS , 1.0 );
		Globals.gScreenCoord               = (emitterPositionCS.xy / emitterPositionCS.w) * 0.5 + 0.5;
		
		Globals.VertexTangent_WorldSpace   = rhp.tangentWS.xyz;
		Globals.VertexNormal_WorldSpace    = rhp.normalWS;
		Globals.VertexBinormal_WorldSpace  = cross( Globals.VertexNormal_WorldSpace, Globals.VertexTangent_WorldSpace.xyz ) * rhp.tangentWS.w;
		Globals.SurfacePosition_WorldSpace = rhp.positionWS;
	} else
	#endif
	
	{
		Globals.BumpedNormal               = float3( 0.0 );
		Globals.ViewDirWS                  = normalize(sc_Camera.position - varPos);
		Globals.PositionWS                 = varPos;
		Globals.VertexColor                = varColor;
		Globals.Surface_UVCoord0           = varTex01.xy;
		Globals.Surface_UVCoord1           = varTex01.zw;
		
		#ifdef                             VERTEX_SHADER
		
		float4                             Result = ngsViewProjectionMatrix * float4( varPos, 1.0 );
		Result.xyz                         /= Result.w; /* map from clip space to NDC space. keep w around so we can re-project back to world*/
		Globals.gScreenCoord               = Result.xy * 0.5 + 0.5;
		
		#else
		
		Globals.gScreenCoord               = getScreenUV().xy;
		
		#endif
		
		Globals.VertexTangent_WorldSpace   = normalize( varTangent.xyz );
		Globals.VertexNormal_WorldSpace    = normalize( varNormal );
		Globals.VertexBinormal_WorldSpace  = cross( Globals.VertexNormal_WorldSpace, Globals.VertexTangent_WorldSpace.xyz ) * varTangent.w;
		Globals.SurfacePosition_WorldSpace = varPos;
		Globals.ViewDirWS                  = normalize( ngsCameraPosition - Globals.SurfacePosition_WorldSpace );
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	/* Input port: 'FinalColor'  */
	
	{
		float4 Result_N363 = float4(0.0); Node363_If_else( float( 0.0 ), float4( 0.0, 0.0, 0.0, 0.0 ), float4( 0.0, 0.0, 0.0, 0.0 ), Result_N363, Globals );
		float4 Export_N364 = float4(0.0); Node364_Float_Export( Result_N363, Export_N364, Globals );
		float4 Output_N5 = float4(0.0); Node5_Color_Parameter( Output_N5, Globals );
		float4 Value_N384 = float4(0.0); Node384_Float_Import( Output_N5, Value_N384, Globals );
		float4 Result_N369 = float4(0.0); Node369_If_else( float( 0.0 ), float4( 0.0, 0.0, 0.0, 0.0 ), NF_PORT_CONSTANT( float4( 1.0, 1.0, 1.0, 1.0 ), Port_Default_N369 ), Result_N369, Globals );
		float4 Output_N148 = float4(0.0); Node148_Multiply( Value_N384, Result_N369, Output_N148, Globals );
		float4 Export_N385 = float4(0.0); Node385_Float_Export( Output_N148, Export_N385, Globals );
		float4 Value_N166 = float4(0.0); Node166_Float_Import( Export_N385, Value_N166, Globals );
		float Output_N168 = 0.0; Node168_Swizzle( Value_N166, Output_N168, Globals );
		float Result_N204 = 0.0; Node204_If_else( float( 0.0 ), float( 0.0 ), NF_PORT_CONSTANT( float( 1.0 ), Port_Default_N204 ), Result_N204, Globals );
		float Output_N72 = 0.0; Node72_Conditional( float( 1.0 ), float( 1.0 ), NF_PORT_CONSTANT( float( 1.0 ), Port_Input2_N072 ), Output_N72, Globals );
		float Output_N205 = 0.0; Node205_Multiply( Output_N168, Result_N204, Output_N72, Output_N205, Globals );
		float Export_N158 = 0.0; Node158_Float_Export( Output_N205, Export_N158, Globals );
		float3 Result_N337 = float3(0.0); Node337_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), float3( 0.0, 0.0, 0.0 ), Result_N337, Globals );
		float3 Export_N334 = float3(0.0); Node334_Float_Export( Result_N337, Export_N334, Globals );
		float3 Result_N103 = float3(0.0); Node103_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), NF_PORT_CONSTANT( float3( 0.0, 0.0, 0.0 ), Port_Default_N103 ), Result_N103, Globals );
		float3 Result_N134 = float3(0.0); Node134_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), NF_PORT_CONSTANT( float3( 0.0, 0.0, 0.0 ), Port_Default_N134 ), Result_N134, Globals );
		float3 Export_N303 = float3(0.0); Node303_Float_Export( Result_N134, Export_N303, Globals );
		float3 Value_N298 = float3(0.0); Node298_Float_Import( Export_N303, Value_N298, Globals );
		float3 Result_N173 = float3(0.0); Node173_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), NF_PORT_CONSTANT( float3( 0.0, 0.0, 0.0 ), Port_Default_N173 ), Result_N173, Globals );
		float3 Export_N347 = float3(0.0); Node347_Float_Export( Result_N173, Export_N347, Globals );
		float3 Value_N306 = float3(0.0); Node306_Float_Import( Export_N347, Value_N306, Globals );
		float3 Output_N299 = float3(0.0); Node299_Add( Result_N103, Value_N298, Value_N306, Output_N299, Globals );
		float3 Output_N251 = float3(0.0); Node251_Linear_to_sRGB( Output_N299, Output_N251, Globals );
		float3 Export_N300 = float3(0.0); Node300_Float_Export( Output_N251, Export_N300, Globals );
		float Output_N242 = 0.0; Node242_Float_Parameter( Output_N242, Globals );
		float Value_N277 = 0.0; Node277_Float_Import( Output_N242, Value_N277, Globals );
		Node220_Texture_2D_Object_Parameter( Globals );
		Node279_Texture_Object_2D_Import( Globals );
		float2 Result_N176 = float2(0.0); Node176_Switch( float( 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), float2( 0.0, 0.0 ), Result_N176, Globals );
		float4 Color_N178 = float4(0.0); Node178_Texture_2D_Sample( Result_N176, Color_N178, Globals );
		float Value1_N304 = 0.0; float Value2_N304 = 0.0; Node304_Split_Vector( Color_N178.xy, Value1_N304, Value2_N304, Globals );
		float Output_N317 = 0.0; Node317_Multiply( Value_N277, Value1_N304, Output_N317, Globals );
		float Export_N222 = 0.0; Node222_Float_Export( Output_N317, Export_N222, Globals );
		float Output_N243 = 0.0; Node243_Float_Parameter( Output_N243, Globals );
		float Value_N278 = 0.0; Node278_Float_Import( Output_N243, Value_N278, Globals );
		float Output_N313 = 0.0; Node313_Multiply( Value_N278, Value2_N304, Output_N313, Globals );
		float Export_N224 = 0.0; Node224_Float_Export( Output_N313, Export_N224, Globals );
		float3 Result_N188 = float3(0.0); Node188_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), float3( 0.0, 0.0, 0.0 ), Result_N188, Globals );
		float3 Export_N230 = float3(0.0); Node230_Float_Export( Result_N188, Export_N230, Globals );
		float3 Result_N79 = float3(0.0); Node79_If_else( float( 0.0 ), NF_PORT_CONSTANT( float3( 0.0, 0.0, 0.0 ), Port_Value1_N079 ), float3( 0.0, 0.0, 0.0 ), Result_N79, Globals );
		float3 Export_N232 = float3(0.0); Node232_Float_Export( Result_N79, Export_N232, Globals );
		float4 Output_N36 = float4(0.0); Node36_PBR_Lighting( Export_N364.xyz, Export_N158, Export_N334, Export_N300, Export_N222, Export_N224, Export_N230, Export_N232, Output_N36, Globals );
		
		FinalColor = Output_N36;
	}
	
	#if SC_RT_RECEIVER_MODE
	
	#else
	
	
	
	
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	
	#if defined(SC_ENABLE_RT_CASTER) && !SC_RT_RECEIVER_MODE
	if (bool(sc_ProxyMode)) {
		sc_writeFragData0( encodeReflection( FinalColor ) );
		return;
	}
	#endif
	
	FinalColor = ngsPixelShader( FinalColor );
	
	NF_PREVIEW_OUTPUT_PIXEL()
	
	#ifdef STUDIO
	vec4 Cost = getPixelRenderingCost();
	if ( Cost.w > 0.0 )
	FinalColor = Cost;
	#endif
	
	FinalColor = max( FinalColor, 0.0 );
	FinalColor = sc_OutputMotionVectorIfNeeded(FinalColor);
	processOIT( FinalColor );
	
	#endif
}

#endif // #ifdef FRAGMENT_SHADER
