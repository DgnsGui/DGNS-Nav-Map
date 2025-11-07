#version 310 es

//-----------------------------------------------------------------------
// Copyright (c) 2019 Snap Inc.
//-----------------------------------------------------------------------

// SCC_FRONTEND_SHADER_FLAGS_BEGIN__
// SCC_FRONTEND_SHADER_FLAGS_END__

// SCC_BACKEND_SHADER_FLAGS_BEGIN__
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

SPEC_CONST(bool) Tweak_N38 = false;


// Material Parameters ( Tweaks )

uniform NF_PRECISION                   float4 baseColor; // Title: Base Color
SC_DECLARE_TEXTURE(iridescenceMap); // Title: Iridescence Map
uniform NF_PRECISION                   float  exponent; // Title: Exponent
uniform NF_PRECISION                   float2 noiseScale; // Title: Noise Scale
uniform NF_PRECISION                   float  noiseIntensity; // Title: Noise Intensity
uniform NF_PRECISION                   float  thinFilmWeight; // Title: Thin Film Weight
uniform NF_PRECISION                   float  intensity; // Title: Intensity
uniform NF_PRECISION                   float  mixAmount; // Title: Mix
uniform NF_PRECISION                   float  metallic; // Title: Metallic
uniform NF_PRECISION                   float  roughness; // Title: Roughness
SC_DECLARE_TEXTURE(opacityTexture); // Title: Texture	


// Uniforms ( Ports )

#if defined( STUDIO )
uniform NF_PRECISION float4 Port_Import_N026;
uniform NF_PRECISION float Port_Import_N033;
uniform NF_PRECISION float2 Port_Import_N042;
uniform NF_PRECISION float Port_Input1_N011;
uniform NF_PRECISION float Port_Input1_N012;
uniform NF_PRECISION float2 Port_Scale_N041;
uniform NF_PRECISION float Port_Input1_N025;
uniform NF_PRECISION float Port_Import_N036;
uniform NF_PRECISION float Port_Input2_N021;
uniform NF_PRECISION float Port_Import_N048;
uniform NF_PRECISION float Port_RangeMinA_N049;
uniform NF_PRECISION float Port_RangeMaxA_N049;
uniform NF_PRECISION float Port_RangeMinB_N049;
uniform NF_PRECISION float Port_RangeMaxB_N049;
uniform NF_PRECISION float Port_Import_N002;
uniform NF_PRECISION float Port_Import_N007;
uniform NF_PRECISION float Port_Opacity_N006;
uniform NF_PRECISION float3 Port_Normal_N006;
uniform NF_PRECISION float3 Port_Emissive_N006;
uniform NF_PRECISION float3 Port_AO_N006;
uniform NF_PRECISION float3 Port_SpecularAO_N006;
uniform NF_PRECISION float Port_Input2_N040;
uniform NF_PRECISION float Port_Input1_N058;
uniform NF_PRECISION float Port_Input2_N058;
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
	float3 VertexNormal_WorldSpace;
	float3 SurfacePosition_WorldSpace;
	float3 SurfacePosition_ObjectSpace;
	float2 Surface_UVCoord0;
};

ssGlobals tempGlobals;
#define scCustomCodeUniform	

//----------

// Functions

void Node8_Color_Parameter( out float4 Output, ssGlobals Globals ) { Output = baseColor; }
#define Node26_Float_Import( Import, Value, Globals ) Value = Import
#define Node27_Texture_2D_Object_Parameter( Globals ) /*nothing*/
#define Node28_Texture_Object_2D_Import( Globals ) /*nothing*/
#define Node30_Camera_Facing_Ratio( Ratio, Globals ) Ratio = 1.0 - saturate( dot( Globals.ViewDirWS, Globals.VertexNormal_WorldSpace ) )
void Node45_Float_Parameter( out float Output, ssGlobals Globals ) { Output = exponent; }
#define Node33_Float_Import( Import, Value, Globals ) Value = Import
#define Node31_Pow( Input0, Input1, Output, Globals ) Output = ( Input0 <= 0.0 ) ? 0.0 : pow( Input0, Input1 )
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) 
{
	if ( DEVICE_IS_FAST )
	{
		// Precompute values for skewed triangular grid
		const vec4 C = vec4(0.211324865405187,
			// (3.0-sqrt(3.0))/6.0
			0.366025403784439,
			// 0.5*(sqrt(3.0)-1.0)
			-0.577350269189626,
			// -1.0 + 2.0 * C.x
			0.024390243902439);
		// 1.0 / 41.0
		
		// First corner (x0)
		vec2 i  = floor(v + dot(v, C.yy));
		vec2 x0 = v - i + dot(i, C.xx);
		
		// Other two corners (x1, x2)
		vec2 i1 = vec2(0.0);
		i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
		vec2 x1 = x0.xy + C.xx - i1;
		vec2 x2 = x0.xy + C.zz;
		
		// Do some permutations to avoid
		// truncation effects in permutation
		i = mod289(i);
		vec3 p = permute(
			permute( i.y + vec3(0.0, i1.y, 1.0))
			+ i.x + vec3(0.0, i1.x, 1.0 ));
		
		vec3 m = max(0.5 - vec3(
				dot(x0,x0),
				dot(x1,x1),
				dot(x2,x2)
			), 0.0);
		
		m = m*m ;
		m = m*m ;
		
		// Gradients:
		//  41 pts uniformly over a line, mapped onto a diamond
		//  The ring size 17*17 = 289 is close to a multiple
		//      of 41 (41*7 = 287)
		
		vec3 x = 2.0 * fract(p * C.www) - 1.0;
		vec3 h = abs(x) - 0.5;
		vec3 ox = floor(x + 0.5);
		vec3 a0 = x - ox;
		
		// Normalise gradients implicitly by scaling m
		// Approximation of: m *= inversesqrt(a0*a0 + h*h);
		m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
		
		// Compute final noise value at P
		vec3 g = vec3(0.0);
		g.x  = a0.x  * x0.x  + h.x  * x0.y;
		g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
		return 130.0 * dot(m, g);
	}
	else
	{
		return 0.0;
	}
}
#define Node35_Surface_Position( Position, Globals ) Position = Globals.SurfacePosition_ObjectSpace
#define Node18_Swizzle( Input, Output, Globals ) Output = float2( Input.x, Input.y )
void Node44_Float_Parameter( out float2 Output, ssGlobals Globals ) { Output = noiseScale; }
#define Node42_Float_Import( Import, Value, Globals ) Value = Import
void Node37_Noise_Simplex( in float2 Seed, in float2 Scale, out float Noise, ssGlobals Globals )
{ 
	ssPRECISION_LIMITER( Seed.x )
	ssPRECISION_LIMITER( Seed.y )
	Seed *= Scale * 0.5;
	Noise = snoise( Seed ) * 0.5 + 0.5;
	ssPRECISION_LIMITER( Noise );
}
#define Node11_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node12_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - Input1
#define Node13_Swizzle( Input, Output, Globals ) Output = Input.z
#define Node14_Construct_Vector( Value1, Value2, Value, Globals ) Value.x = Value1; Value.y = Value2
void Node41_Noise_Simplex( in float2 Seed, in float2 Scale, out float Noise, ssGlobals Globals )
{ 
	ssPRECISION_LIMITER( Seed.x )
	ssPRECISION_LIMITER( Seed.y )
	Seed *= Scale * 0.5;
	Noise = snoise( Seed ) * 0.5 + 0.5;
	ssPRECISION_LIMITER( Noise );
}
#define Node25_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - Input1
void Node43_Float_Parameter( out float Output, ssGlobals Globals ) { Output = noiseIntensity; }
#define Node36_Float_Import( Import, Value, Globals ) Value = Import
#define Node21_Multiply( Input0, Input1, Input2, Output, Globals ) Output = Input0 * Input1 * Input2
#define Node20_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
void Node32_Float_Parameter( out float Output, ssGlobals Globals ) { Output = thinFilmWeight; }
#define Node48_Float_Import( Import, Value, Globals ) Value = clamp( Import, 0.0, 1.0 )
void Node49_Remap( in float ValueIn, out float ValueOut, in float RangeMinA, in float RangeMaxA, in float RangeMinB, in float RangeMaxB, ssGlobals Globals )
{ 
	ValueOut = ( ( ValueIn - RangeMinA ) / ( RangeMaxA - RangeMinA + SC_EPSILON ) ) * ( RangeMaxB - RangeMinB ) + RangeMinB;
	ValueOut = ( RangeMaxB > RangeMinB ) ? clamp( ValueOut, RangeMinB, RangeMaxB ) : clamp( ValueOut, RangeMaxB, RangeMinB );
}
#define Node22_Construct_Vector( Value1, Value2, Value, Globals ) Value.x = Value1; Value.y = Value2
#define Node29_Texture_2D_Sample( UVCoord, Color, Globals ) Color = SC_SAMPLE_TEX_R(iridescenceMap, UVCoord, 0.0)
void Node9_Float_Parameter( out float Output, ssGlobals Globals ) { Output = intensity; }
#define Node2_Float_Import( Import, Value, Globals ) Value = Import
#define Node24_Multiply( Input0, Input1, Input2, Output, Globals ) Output = Input0 * Input1 * float4(Input2)
void Node10_Float_Parameter( out float Output, ssGlobals Globals ) { Output = mixAmount; }
#define Node7_Float_Import( Import, Value, Globals ) Value = Import
#define Node5_Mix( Input0, Input1, Input2, Output, Globals ) Output = mix( Input0, Input1, float4(Input2) )
#define Node23_Float_Export( Value, Export, Globals ) Export = Value
void Node0_Float_Parameter( out float Output, ssGlobals Globals ) { Output = metallic; }
void Node1_Float_Parameter( out float Output, ssGlobals Globals ) { Output = roughness; }
void Node6_PBR_Lighting( in float3 Albedo, in float Opacity, in float3 Normal, in float3 Emissive, in float Metallic, in float Roughness, in float3 AO, in float3 SpecularAO, out float4 Output, ssGlobals Globals )
{ 
	if ( !sc_ProjectiveShadowsCaster )
	{
		Globals.BumpedNormal = Globals.VertexNormal_WorldSpace;
	}
	
	
	
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
		Metallic = clamp( Metallic, 0.0, 1.0 );
		
		Roughness = clamp( Roughness, 0.0, 1.0 );
		Output = ngsCalculateLighting( Albedo, Opacity, Globals.BumpedNormal, Globals.PositionWS, Globals.ViewDirWS, Emissive, Metallic, Roughness, AO, SpecularAO );
	}			
	
	Output = max( Output, 0.0 );
	
	#endif //#if SC_RT_RECEIVER_MODE
}
#define Node47_Swizzle( Input, Output, Globals ) Output = Input.a
void Node38_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N38 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node39_Texture_2D_Parameter( Output, Globals ) Output = SC_SAMPLE_TEX_R(opacityTexture, Globals.Surface_UVCoord0, 0.0)
void Node40_Conditional( in float Input0, in float4 Input1, in float Input2, out float4 Output, ssGlobals Globals )
{ 
	#if 0
	/* Input port: "Input0"  */
	
	{
		float Output_N38 = 0.0; Node38_Bool_Parameter( Output_N38, Globals );
		
		Input0 = Output_N38;
	}
	#endif
	
	if ( bool( Tweak_N38 ) ) 
	{ 
		/* Input port: "Input1"  */
		
		{
			float4 Output_N39 = float4(0.0); Node39_Texture_2D_Parameter( Output_N39, Globals );
			
			Input1 = Output_N39;
		}
		Output = Input1; 
	} 
	else 
	{ 
		
		Output = float4(Input2); 
	}
}
#define Node46_Swizzle( Input, Output, Globals ) Output = Input
#define Node57_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node58_Clamp( Input0, Input1, Input2, Output, Globals ) Output = clamp( Input0 + 0.001, Input1 + 0.001, Input2 + 0.001 ) - 0.001
#define Node60_Construct_Vector( Value1, Value2, Value, Globals ) Value.xyz = Value1; Value.w = Value2
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
		
		Globals.BumpedNormal                = float3( 0.0 );
		Globals.ViewDirWS                   = rhp.viewDirWS;
		Globals.PositionWS                  = rhp.positionWS;
		Globals.VertexNormal_WorldSpace     = rhp.normalWS;
		Globals.SurfacePosition_WorldSpace  = rhp.positionWS;
		Globals.SurfacePosition_ObjectSpace = ( ngsModelMatrixInverse * float4( rhp.positionWS, 1.0 ) ).xyz;
		Globals.Surface_UVCoord0            = rhp.uv0;
	} else
	#endif
	
	{
		Globals.BumpedNormal                = float3( 0.0 );
		Globals.ViewDirWS                   = normalize(sc_Camera.position - varPos);
		Globals.PositionWS                  = varPos;
		Globals.VertexNormal_WorldSpace     = normalize( varNormal );
		Globals.SurfacePosition_WorldSpace  = varPos;
		Globals.ViewDirWS                   = normalize( ngsCameraPosition - Globals.SurfacePosition_WorldSpace );
		Globals.SurfacePosition_ObjectSpace = ( ngsModelMatrixInverse * float4( varPos, 1.0 ) ).xyz;
		Globals.Surface_UVCoord0            = varTex01.xy;
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	/* Input port: 'FinalColor'  */
	
	{
		float4 Output_N8 = float4(0.0); Node8_Color_Parameter( Output_N8, Globals );
		float4 Value_N26 = float4(0.0); Node26_Float_Import( Output_N8, Value_N26, Globals );
		Node27_Texture_2D_Object_Parameter( Globals );
		Node28_Texture_Object_2D_Import( Globals );
		float Ratio_N30 = 0.0; Node30_Camera_Facing_Ratio( Ratio_N30, Globals );
		float Output_N45 = 0.0; Node45_Float_Parameter( Output_N45, Globals );
		float Value_N33 = 0.0; Node33_Float_Import( Output_N45, Value_N33, Globals );
		float Output_N31 = 0.0; Node31_Pow( Ratio_N30, Value_N33, Output_N31, Globals );
		float3 Position_N35 = float3(0.0); Node35_Surface_Position( Position_N35, Globals );
		float2 Output_N18 = float2(0.0); Node18_Swizzle( Position_N35.xy, Output_N18, Globals );
		float2 Output_N44 = float2(0.0); Node44_Float_Parameter( Output_N44, Globals );
		float2 Value_N42 = float2(0.0); Node42_Float_Import( Output_N44, Value_N42, Globals );
		float Noise_N37 = 0.0; Node37_Noise_Simplex( Output_N18, Value_N42, Noise_N37, Globals );
		float Output_N11 = 0.0; Node11_Multiply( Noise_N37, NF_PORT_CONSTANT( float( 2.0 ), Port_Input1_N011 ), Output_N11, Globals );
		float Output_N12 = 0.0; Node12_Subtract( Output_N11, NF_PORT_CONSTANT( float( 1.0 ), Port_Input1_N012 ), Output_N12, Globals );
		float Output_N13 = 0.0; Node13_Swizzle( Position_N35, Output_N13, Globals );
		float2 Value_N14 = float2(0.0); Node14_Construct_Vector( Output_N12, Output_N13, Value_N14, Globals );
		float Noise_N41 = 0.0; Node41_Noise_Simplex( Value_N14, NF_PORT_CONSTANT( float2( 3.0, 3.0 ), Port_Scale_N041 ), Noise_N41, Globals );
		float Output_N25 = 0.0; Node25_Subtract( Noise_N41, NF_PORT_CONSTANT( float( 0.5 ), Port_Input1_N025 ), Output_N25, Globals );
		float Output_N43 = 0.0; Node43_Float_Parameter( Output_N43, Globals );
		float Value_N36 = 0.0; Node36_Float_Import( Output_N43, Value_N36, Globals );
		float Output_N21 = 0.0; Node21_Multiply( Output_N25, Value_N36, NF_PORT_CONSTANT( float( 0.2 ), Port_Input2_N021 ), Output_N21, Globals );
		float Output_N20 = 0.0; Node20_Add( Output_N31, Output_N21, Output_N20, Globals );
		float Output_N32 = 0.0; Node32_Float_Parameter( Output_N32, Globals );
		float Value_N48 = 0.0; Node48_Float_Import( Output_N32, Value_N48, Globals );
		float ValueOut_N49 = 0.0; Node49_Remap( Value_N48, ValueOut_N49, NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinA_N049 ), NF_PORT_CONSTANT( float( 1.0 ), Port_RangeMaxA_N049 ), NF_PORT_CONSTANT( float( 0.1665 ), Port_RangeMinB_N049 ), NF_PORT_CONSTANT( float( 0.8335 ), Port_RangeMaxB_N049 ), Globals );
		float2 Value_N22 = float2(0.0); Node22_Construct_Vector( Output_N20, ValueOut_N49, Value_N22, Globals );
		float4 Color_N29 = float4(0.0); Node29_Texture_2D_Sample( Value_N22, Color_N29, Globals );
		float Output_N9 = 0.0; Node9_Float_Parameter( Output_N9, Globals );
		float Value_N2 = 0.0; Node2_Float_Import( Output_N9, Value_N2, Globals );
		float4 Output_N24 = float4(0.0); Node24_Multiply( Value_N26, Color_N29, Value_N2, Output_N24, Globals );
		float Output_N10 = 0.0; Node10_Float_Parameter( Output_N10, Globals );
		float Value_N7 = 0.0; Node7_Float_Import( Output_N10, Value_N7, Globals );
		float4 Output_N5 = float4(0.0); Node5_Mix( Value_N26, Output_N24, Value_N7, Output_N5, Globals );
		float4 Export_N23 = float4(0.0); Node23_Float_Export( Output_N5, Export_N23, Globals );
		float Output_N0 = 0.0; Node0_Float_Parameter( Output_N0, Globals );
		float Output_N1 = 0.0; Node1_Float_Parameter( Output_N1, Globals );
		float4 Output_N6 = float4(0.0); Node6_PBR_Lighting( Export_N23.xyz, NF_PORT_CONSTANT( float( 1.0 ), Port_Opacity_N006 ), NF_PORT_CONSTANT( float3( 0.0, 1.0, 0.0 ), Port_Normal_N006 ), NF_PORT_CONSTANT( float3( 0.0, 0.0, 0.0 ), Port_Emissive_N006 ), Output_N0, Output_N1, NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_AO_N006 ), NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_SpecularAO_N006 ), Output_N6, Globals );
		float Output_N47 = 0.0; Node47_Swizzle( Export_N23, Output_N47, Globals );
		float4 Output_N40 = float4(0.0); Node40_Conditional( float( 1.0 ), float4( 1.0, 1.0, 1.0, 1.0 ), NF_PORT_CONSTANT( float( 1.0 ), Port_Input2_N040 ), Output_N40, Globals );
		float Output_N46 = 0.0; Node46_Swizzle( Output_N40.x, Output_N46, Globals );
		float Output_N57 = 0.0; Node57_Multiply( Output_N47, Output_N46, Output_N57, Globals );
		float Output_N58 = 0.0; Node58_Clamp( Output_N57, NF_PORT_CONSTANT( float( 0.0 ), Port_Input1_N058 ), NF_PORT_CONSTANT( float( 1.0 ), Port_Input2_N058 ), Output_N58, Globals );
		float4 Value_N60 = float4(0.0); Node60_Construct_Vector( Output_N6.xyz, Output_N58, Value_N60, Globals );
		
		FinalColor = Value_N60;
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
