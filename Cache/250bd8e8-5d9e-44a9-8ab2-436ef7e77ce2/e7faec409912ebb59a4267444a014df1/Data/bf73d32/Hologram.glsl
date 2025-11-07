#version 310 es

//-----------------------------------------------------------------------
// Copyright (c) 2019 Snap Inc.
//-----------------------------------------------------------------------

// SCC_FRONTEND_SHADER_FLAGS_BEGIN__
// SCC_FRONTEND_SHADER_FLAGS_END__

// SCC_BACKEND_SHADER_FLAGS_BEGIN__
// SCC_BACKEND_SHADER_FLAG_DISABLE_FRUSTUM_CULLING
// SCC_BACKEND_SHADER_FLAGS_END__


#define SC_FRAG_DATA_COUNT 1


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

#define ENABLE_LIGHTING false
#define ENABLE_DIFFUSE_LIGHTING false
#define ENABLE_SPECULAR_LIGHTING false


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

const bool SC_ENABLE_SRGB_EMULATION_IN_SHADER = false;


//-----------------------------------------------------------------------
// Varyings
//-----------------------------------------------------------------------

varying vec4 varColor;

//-----------------------------------------------------------------------
// User includes
//-----------------------------------------------------------------------
#include "includes/utils.glsl"		


#include "includes/blend_modes.glsl"
#include "includes/oit.glsl" 

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


//-----------------------------------------------------------------------


// Spec Consts

SPEC_CONST(bool) Tweak_N75 = false;
SPEC_CONST(bool) Tweak_N76 = false;
SPEC_CONST(bool) Tweak_N87 = false;
SPEC_CONST(bool) Tweak_N130 = false;
SPEC_CONST(bool) animated = false;
SPEC_CONST(bool) Tweak_N68 = false;
SPEC_CONST(bool) Tweak_N89 = false;
SPEC_CONST(bool) Tweak_N12 = false;


// Material Parameters ( Tweaks )

uniform NF_PRECISION                   float  glitchFrequency; // Title: Frequency
uniform NF_PRECISION                   float  glitchSpeed; // Title: Speed
uniform NF_PRECISION                   float  glitchOffset; // Title: Offset
uniform NF_PRECISION                   float  glitchIntensity; // Title: Intensity
uniform NF_PRECISION                   float  glitchScale; // Title: Scale
uniform NF_PRECISION                   float  thickLines; // Title: Thick Lines
uniform NF_PRECISION                   float  scanlineSpeed; // Title: Speed
uniform NF_PRECISION                   float  Offset; // Title: Offset
uniform NF_PRECISION                   float  randScale; // Title: Scale
uniform NF_PRECISION                   float4 thicklinesColor; // Title: Thick Lines Color
uniform NF_PRECISION                   float  thinLines; // Title: Thin Lines
uniform NF_PRECISION                   float4 thinlinesColor; // Title: Thin Lines Color
uniform NF_PRECISION                   float4 rimTint; // Title: Tint
SC_DECLARE_TEXTURE(opacityTexture); // Title: Texture	


// Uniforms ( Ports )

#if defined( STUDIO )
uniform NF_PRECISION float Port_Import_N050;
uniform NF_PRECISION float Port_RangeMinA_N034;
uniform NF_PRECISION float Port_RangeMaxA_N034;
uniform NF_PRECISION float Port_RangeMinB_N034;
uniform NF_PRECISION float Port_RangeMaxB_N034;
uniform NF_PRECISION float Port_RangeMinA_N002;
uniform NF_PRECISION float Port_RangeMaxA_N002;
uniform NF_PRECISION float Port_RangeMinB_N002;
uniform NF_PRECISION float Port_RangeMaxB_N002;
uniform NF_PRECISION float Port_RangeMinA_N103;
uniform NF_PRECISION float Port_RangeMaxA_N103;
uniform NF_PRECISION float Port_RangeMinB_N103;
uniform NF_PRECISION float Port_RangeMaxB_N103;
uniform NF_PRECISION float Port_Import_N028;
uniform NF_PRECISION float Port_Input1_N055;
uniform NF_PRECISION float Port_Input1_N056;
uniform NF_PRECISION float Port_Input1_N066;
uniform NF_PRECISION float Port_Import_N093;
uniform NF_PRECISION float Port_Import_N198;
uniform NF_PRECISION float Port_Import_N203;
uniform NF_PRECISION float Port_Import_N038;
uniform NF_PRECISION float3 Port_Import_N179;
uniform NF_PRECISION float Port_Input0_N009;
uniform NF_PRECISION float3 Port_Import_N180;
uniform NF_PRECISION float Port_Import_N181;
uniform NF_PRECISION float Port_Input1_N182;
uniform NF_PRECISION float Port_Input2_N182;
uniform NF_PRECISION float3 Port_Import_N167;
uniform NF_PRECISION float Port_Import_N174;
uniform NF_PRECISION float2 Port_Scale_N164;
uniform NF_PRECISION float Port_Input1_N140;
uniform NF_PRECISION float Port_Input1_N141;
uniform NF_PRECISION float Port_Input2_N110;
uniform NF_PRECISION float Port_Input1_N117;
uniform NF_PRECISION float Port_RangeMinA_N063;
uniform NF_PRECISION float Port_RangeMaxA_N063;
uniform NF_PRECISION float Port_RangeMinB_N063;
uniform NF_PRECISION float Port_RangeMaxB_N063;
uniform NF_PRECISION float Port_RangeMinA_N067;
uniform NF_PRECISION float Port_RangeMaxA_N067;
uniform NF_PRECISION float Port_RangeMinB_N067;
uniform NF_PRECISION float Port_RangeMaxB_N067;
uniform NF_PRECISION float Port_Input1_N078;
uniform NF_PRECISION float Port_Input0_N129;
uniform NF_PRECISION float3 Port_Import_N070;
uniform NF_PRECISION float3 Port_Import_N069;
uniform NF_PRECISION float Port_Import_N071;
uniform NF_PRECISION float Port_Input1_N072;
uniform NF_PRECISION float Port_Input2_N072;
uniform NF_PRECISION float3 Port_Import_N094;
uniform NF_PRECISION float Port_Import_N106;
uniform NF_PRECISION float2 Port_Scale_N041;
uniform NF_PRECISION float Port_Input1_N122;
uniform NF_PRECISION float Port_Input1_N125;
uniform NF_PRECISION float Port_Input1_N126;
uniform NF_PRECISION float Port_Input2_N126;
uniform NF_PRECISION float Port_Input1_N020;
uniform NF_PRECISION float Port_Input1_N049;
uniform NF_PRECISION float Port_Input2_N014;
uniform NF_PRECISION float Port_Input1_N058;
uniform NF_PRECISION float Port_Input2_N058;
#endif	



//-----------------------------------------------------------------------



//-----------------------------------------------------------------------

#ifdef VERTEX_SHADER

//----------

// Globals

struct ssGlobals
{
	float gTimeElapsed;
	float gTimeDelta;
	float gTimeElapsedShifted;
	
	float3 SurfacePosition_ObjectSpace;
	float3 VertexNormal_WorldSpace;
	float3 VertexNormal_ObjectSpace;
	float2 gTriplanarCoords;
	float3 SurfacePosition_WorldSpace;
	float2 gScreenCoord;
};

ssGlobals tempGlobals;
#define scCustomCodeUniform	

//----------

// Functions

void Node75_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N75 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
void Node76_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N76 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node36_And( A, B, Result, Globals ) Result = float( ( A * 1.0 != 0.0 ) && ( B * 1.0 != 0.0 ) ? 1.0 : 0.0 )
void Node222_Float_Parameter( out float Output, ssGlobals Globals ) { Output = glitchFrequency; }
#define Node50_Float_Import( Import, Value, Globals ) Value = Import
#define Node34_Remap( ValueIn, ValueOut, RangeMinA, RangeMaxA, RangeMinB, RangeMaxB, Globals ) ValueOut = ( ( ValueIn - RangeMinA ) / ( RangeMaxA - RangeMinA + SC_EPSILON ) ) * ( RangeMaxB - RangeMinB ) + RangeMinB
void Node87_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N87 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
void Node31_Float_Parameter( out float Output, ssGlobals Globals ) { Output = glitchSpeed; }
#define Node2_Remap( ValueIn, ValueOut, RangeMinA, RangeMaxA, RangeMinB, RangeMaxB, Globals ) ValueOut = ( ( ValueIn - RangeMinA ) / ( RangeMaxA - RangeMinA + SC_EPSILON ) ) * ( RangeMaxB - RangeMinB ) + RangeMinB
#define Node101_Elapsed_Time( Multiplier, Time, Globals ) Time = Globals.gTimeElapsed * Multiplier
void Node102_Float_Parameter( out float Output, ssGlobals Globals ) { Output = glitchOffset; }
#define Node103_Remap( ValueIn, ValueOut, RangeMinA, RangeMaxA, RangeMinB, RangeMaxB, Globals ) ValueOut = ( ( ValueIn - RangeMinA ) / ( RangeMaxA - RangeMinA + SC_EPSILON ) ) * ( RangeMaxB - RangeMinB ) + RangeMinB
#define Node104_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
void Node105_If_else( in float Bool1, in float Value1, in float Default, out float Result, ssGlobals Globals )
{ 
	if ( bool( Tweak_N87 ) )
	{
		/* Input port: "Value1"  */
		
		{
			float Output_N31 = 0.0; Node31_Float_Parameter( Output_N31, Globals );
			float ValueOut_N2 = 0.0; Node2_Remap( Output_N31, ValueOut_N2, NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinA_N002 ), NF_PORT_CONSTANT( float( 1.0 ), Port_RangeMaxA_N002 ), NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinB_N002 ), NF_PORT_CONSTANT( float( 2.0 ), Port_RangeMaxB_N002 ), Globals );
			float Time_N101 = 0.0; Node101_Elapsed_Time( ValueOut_N2, Time_N101, Globals );
			float Output_N102 = 0.0; Node102_Float_Parameter( Output_N102, Globals );
			float ValueOut_N103 = 0.0; Node103_Remap( Output_N102, ValueOut_N103, NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinA_N103 ), NF_PORT_CONSTANT( float( 1.0 ), Port_RangeMaxA_N103 ), NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinB_N103 ), NF_PORT_CONSTANT( float( 100.0 ), Port_RangeMaxB_N103 ), Globals );
			float Output_N104 = 0.0; Node104_Add( Time_N101, ValueOut_N103, Output_N104, Globals );
			
			Value1 = Output_N104;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float Output_N102 = 0.0; Node102_Float_Parameter( Output_N102, Globals );
			float ValueOut_N103 = 0.0; Node103_Remap( Output_N102, ValueOut_N103, NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinA_N103 ), NF_PORT_CONSTANT( float( 1.0 ), Port_RangeMaxA_N103 ), NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinB_N103 ), NF_PORT_CONSTANT( float( 100.0 ), Port_RangeMaxB_N103 ), Globals );
			
			Default = ValueOut_N103;
		}
		Result = Default;
	}
}
#define Node28_Float_Import( Import, Value, Globals ) Value = Import
#define Node53_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node54_Fract( Input0, Output, Globals ) Output = fract( Input0 )
#define Node55_Is_Less( Input0, Input1, Output, Globals ) Output = ssSmaller( Input0, Input1 )
#define Node56_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node65_Fract( Input0, Output, Globals ) Output = fract( Input0 )
#define Node66_Is_Less( Input0, Input1, Output, Globals ) Output = ssSmaller( Input0, Input1 )
#define Node82_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
#define Node88_Surface_Position( Position, Globals ) Position = Globals.SurfacePosition_ObjectSpace
void Node221_Float_Parameter( out float Output, ssGlobals Globals ) { Output = glitchIntensity; }
#define Node93_Float_Import( Import, Value, Globals ) Value = min( Import, 30.0 )
#define Node198_Float_Import( Import, Value, Globals ) Value = Import
#define Node199_AABB_Max( AABBMax, Globals ) AABBMax = ngsLocalAabbMax
#define Node200_AABB_Min( AABBMin, Globals ) AABBMin = ngsLocalAabbMin
#define Node201_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - Input1
#define Node202_Length( Input0, Output, Globals ) Output = length( Input0 )
#define Node203_Float_Import( Import, Value, Globals ) Value = Import
#define Node204_Multiply( Input0, Input1, Input2, Output, Globals ) Output = Input0 * Input1 * Input2
#define Node205_Float_Export( Value, Export, Globals ) Export = Value
void Node35_Float_Parameter( out float Output, ssGlobals Globals ) { Output = glitchScale; }
#define Node38_Float_Import( Import, Value, Globals ) Value = clamp( Import, 0.0, 1.0 )
#define Node179_Float_Import( Import, Value, Globals ) Value = Import
#define Node9_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node180_Float_Import( Import, Value, Globals ) Value = Import
#define Node181_Float_Import( Import, Value, Globals ) Value = Import
#define Node182_Clamp( Input0, Input1, Input2, Output, Globals ) Output = clamp( Input0 + 0.001, Input1 + 0.001, Input2 + 0.001 ) - 0.001
#define Node165_Surface_Position( Position, Globals ) Position = Globals.SurfacePosition_ObjectSpace
#define Node167_Float_Import( Import, Value, Globals ) Value = Import
#define Node168_AABB_Max( AABBMax, Globals ) AABBMax = ngsLocalAabbMax
#define Node169_AABB_Min( AABBMin, Globals ) AABBMin = ngsLocalAabbMin
#define Node170_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - Input1
#define Node171_Length( Input0, Output, Globals ) Output = length( Input0 )
#define Node172_Divide( Input0, Input1, Output, Globals ) Output = Input0 / (float3(Input1) + 1.234e-6)
#define Node173_Float_Export( Value, Export, Globals ) Export = Value
#define Node174_Float_Import( Import, Value, Globals ) Value = max( Import, 0.0 )
#define Node175_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * float3(Input1)
#define Node178_Surface_Normal( Normal, Globals ) Normal = Globals.VertexNormal_ObjectSpace
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
#define Node163_Triplanar_UV_Coord( Coords, Globals ) Coords = Globals.gTriplanarCoords
void Node164_Noise_Simplex( in float2 Seed, in float2 Scale, out float Noise, ssGlobals Globals )
{ 
	ssPRECISION_LIMITER( Seed.x )
	ssPRECISION_LIMITER( Seed.y )
	Seed *= Scale * 0.5;
	Noise = snoise( Seed ) * 0.5 + 0.5;
	ssPRECISION_LIMITER( Noise );
}
void Node183_Loop_Triplanar_UV( in float Input, in float3 Position, in float3 Normal, in float3 Scale, in float3 Offset, in float Sharpness, out float Output, ssGlobals Globals )
{ 
	/* Input port: "Scale"  */
	
	{
		float Output_N35 = 0.0; Node35_Float_Parameter( Output_N35, Globals );
		float Value_N38 = 0.0; Node38_Float_Import( Output_N35, Value_N38, Globals );
		float3 Value_N179 = float3(0.0); Node179_Float_Import( float3( Value_N38 ), Value_N179, Globals );
		
		Scale = Value_N179;
	}
	/* Input port: "Offset"  */
	
	{
		float Result_N105 = 0.0; Node105_If_else( float( 0.0 ), float( 0.0 ), float( 0.0 ), Result_N105, Globals );
		float Value_N28 = 0.0; Node28_Float_Import( Result_N105, Value_N28, Globals );
		float Output_N9 = 0.0; Node9_Multiply( NF_PORT_CONSTANT( float( 1.0 ), Port_Input0_N009 ), Value_N28, Output_N9, Globals );
		float3 Value_N180 = float3(0.0); Node180_Float_Import( float3( Output_N9 ), Value_N180, Globals );
		
		Offset = Value_N180;
	}
	/* Input port: "Sharpness"  */
	
	{
		float Value_N181 = 0.0; Node181_Float_Import( NF_PORT_CONSTANT( float( 1.0 ), Port_Import_N181 ), Value_N181, Globals );
		float Output_N182 = 0.0; Node182_Clamp( Value_N181, NF_PORT_CONSTANT( float( 0.0 ), Port_Input1_N182 ), NF_PORT_CONSTANT( float( 1.0 ), Port_Input2_N182 ), Output_N182, Globals );
		
		Sharpness = Output_N182;
	}
	/* Input port: "Position"  */
	
	{
		float3 Position_N165 = float3(0.0); Node165_Surface_Position( Position_N165, Globals );
		float3 Value_N167 = float3(0.0); Node167_Float_Import( Position_N165, Value_N167, Globals );
		float3 AABBMax_N168 = float3(0.0); Node168_AABB_Max( AABBMax_N168, Globals );
		float3 AABBMin_N169 = float3(0.0); Node169_AABB_Min( AABBMin_N169, Globals );
		float3 Output_N170 = float3(0.0); Node170_Subtract( AABBMax_N168, AABBMin_N169, Output_N170, Globals );
		float Output_N171 = 0.0; Node171_Length( Output_N170, Output_N171, Globals );
		float3 Output_N172 = float3(0.0); Node172_Divide( Value_N167, Output_N171, Output_N172, Globals );
		float3 Export_N173 = float3(0.0); Node173_Float_Export( Output_N172, Export_N173, Globals );
		float Value_N174 = 0.0; Node174_Float_Import( NF_PORT_CONSTANT( float( 20.0 ), Port_Import_N174 ), Value_N174, Globals );
		float3 Output_N175 = float3(0.0); Node175_Multiply( Export_N173, Value_N174, Output_N175, Globals );
		
		Position = Output_N175;
	}
	/* Input port: "Normal"  */
	
	{
		float3 Normal_N178 = float3(0.0); Node178_Surface_Normal( Normal_N178, Globals );
		
		Normal = Normal_N178;
	}
	
	vec3 p = Position;
	vec3 n = Normal;
	
	p += Offset;
	p *= Scale;
	
	n = abs(n);
	
	// determine major axis (in x; yz are following axis)
	
	ivec3 ma = ( n.x > n.y && n.x > n.z ) ? ivec3( 0, 1, 2 ) : ( n.y > n.z ) ? ivec3( 1, 2, 0 ) : ivec3( 2, 0, 1 );
	
	// determine minor axis (in x; yz are following axis)
	
	ivec3 mi = ( n.x < n.y && n.x < n.z ) ? ivec3( 0, 1, 2 ) : ( n.y < n.z ) ? ivec3( 1, 2, 0 ) : ivec3( 2, 0, 1 );
	
	// determine median axis (in x;  yz are following axis)
	
	ivec3 me = ivec3( 3 ) - mi - ma;
	
	// project + fetch
	
	Globals.gTriplanarCoords = vec2( p[ma.y], p[ma.z]);
	/* Input port: "Input"  */
	
	{
		float2 Coords_N163 = float2(0.0); Node163_Triplanar_UV_Coord( Coords_N163, Globals );
		float Noise_N164 = 0.0; Node164_Noise_Simplex( Coords_N163, NF_PORT_CONSTANT( float2( 1.0, 1.0 ), Port_Scale_N164 ), Noise_N164, Globals );
		
		Input = Noise_N164;
	}
	float x = Input;
	
	Globals.gTriplanarCoords = vec2( p[me.y], p[me.z]);
	/* Input port: "Input"  */
	
	{
		float2 Coords_N163 = float2(0.0); Node163_Triplanar_UV_Coord( Coords_N163, Globals );
		float Noise_N164 = 0.0; Node164_Noise_Simplex( Coords_N163, NF_PORT_CONSTANT( float2( 1.0, 1.0 ), Port_Scale_N164 ), Noise_N164, Globals );
		
		Input = Noise_N164;
	}
	float y = Input;
	
	// blend factors
	
	vec2 w = vec2( n[ma.x], n[me.x] );
	
	// make local support
	
	//w = clamp( ( w - 0.5773 ) / ( 1.0 - 0.5773 ), 0.0, 1.0 );
	
	// shape transition
	
	w = pow( w, vec2( 1.0 / ( 1.0 - Sharpness * 0.99 ) ) );
	
	// blend and return
	
	Output = ( x*w.x + y*w.y ) / ( w.x + w.y );
}
#define Node184_Float_Export( Value, Export, Globals ) Export = Value
#define Node140_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node141_Pow( Input0, Input1, Output, Globals ) Output = ( Input0 <= 0.0 ) ? 0.0 : pow( Input0, Input1 )
#define Node110_Multiply( Input0, Input1, Input2, Output, Globals ) Output = Input0 * Input1 * Input2
#define Node92_Surface_Normal( Normal, Globals ) Normal = Globals.VertexNormal_ObjectSpace
#define Node111_Multiply( Input0, Input1, Output, Globals ) Output = float3(Input0) * Input1
#define Node112_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - Input1
#define Node113_Mixer( A, B, Output1, Globals ) Output1 = vec3( B.x, A.y, B.z )
void Node114_Split_Vector( in float4 Value, out float Value1, out float Value2, out float Value3, out float Value4, ssGlobals Globals )
{ 
	Value1 = Value.x;
	Value2 = Value.y;
	Value3 = Value.z;
	Value4 = Value.w;
}
#define Node115_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node116_Sin( Input0, Output, Globals ) Output = sin( Input0 )
#define Node117_Divide( Input0, Input1, Output, Globals ) Output = Input0 / (Input1 + 1.234e-6)
#define Node118_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node119_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
#define Node120_Construct_Vector( Value1, Value2, Value3, Value4, Value, Globals ) Value.x = Value1; Value.y = Value2; Value.z = Value3; Value.w = Value4
void Node121_Conditional( in float Input0, in float3 Input1, in float3 Input2, out float3 Output, ssGlobals Globals )
{ 
	/* Input port: "Input0"  */
	
	{
		float Output_N222 = 0.0; Node222_Float_Parameter( Output_N222, Globals );
		float Value_N50 = 0.0; Node50_Float_Import( Output_N222, Value_N50, Globals );
		float ValueOut_N34 = 0.0; Node34_Remap( Value_N50, ValueOut_N34, NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinA_N034 ), NF_PORT_CONSTANT( float( 1.0 ), Port_RangeMaxA_N034 ), NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinB_N034 ), NF_PORT_CONSTANT( float( 2.0 ), Port_RangeMaxB_N034 ), Globals );
		float Result_N105 = 0.0; Node105_If_else( float( 0.0 ), float( 0.0 ), float( 0.0 ), Result_N105, Globals );
		float Value_N28 = 0.0; Node28_Float_Import( Result_N105, Value_N28, Globals );
		float Output_N53 = 0.0; Node53_Multiply( ValueOut_N34, Value_N28, Output_N53, Globals );
		float Output_N54 = 0.0; Node54_Fract( Output_N53, Output_N54, Globals );
		float Output_N55 = 0.0; Node55_Is_Less( Output_N54, NF_PORT_CONSTANT( float( 0.1 ), Port_Input1_N055 ), Output_N55, Globals );
		float Output_N56 = 0.0; Node56_Multiply( Output_N53, NF_PORT_CONSTANT( float( 1.294 ), Port_Input1_N056 ), Output_N56, Globals );
		float Output_N65 = 0.0; Node65_Fract( Output_N56, Output_N65, Globals );
		float Output_N66 = 0.0; Node66_Is_Less( Output_N65, NF_PORT_CONSTANT( float( 0.2 ), Port_Input1_N066 ), Output_N66, Globals );
		float Output_N82 = 0.0; Node82_Add( Output_N55, Output_N66, Output_N82, Globals );
		
		Input0 = Output_N82;
	}
	
	if ( bool( Input0 * 1.0 != 0.0 ) ) 
	{ 
		/* Input port: "Input1"  */
		
		{
			float Result_N105 = 0.0; Node105_If_else( float( 0.0 ), float( 0.0 ), float( 0.0 ), Result_N105, Globals );
			float Value_N28 = 0.0; Node28_Float_Import( Result_N105, Value_N28, Globals );
			float3 Position_N88 = float3(0.0); Node88_Surface_Position( Position_N88, Globals );
			float Output_N221 = 0.0; Node221_Float_Parameter( Output_N221, Globals );
			float Value_N93 = 0.0; Node93_Float_Import( Output_N221, Value_N93, Globals );
			float Value_N198 = 0.0; Node198_Float_Import( Value_N93, Value_N198, Globals );
			float3 AABBMax_N199 = float3(0.0); Node199_AABB_Max( AABBMax_N199, Globals );
			float3 AABBMin_N200 = float3(0.0); Node200_AABB_Min( AABBMin_N200, Globals );
			float3 Output_N201 = float3(0.0); Node201_Subtract( AABBMax_N199, AABBMin_N200, Output_N201, Globals );
			float Output_N202 = 0.0; Node202_Length( Output_N201, Output_N202, Globals );
			float Value_N203 = 0.0; Node203_Float_Import( NF_PORT_CONSTANT( float( 1.0 ), Port_Import_N203 ), Value_N203, Globals );
			float Output_N204 = 0.0; Node204_Multiply( Value_N198, Output_N202, Value_N203, Output_N204, Globals );
			float Export_N205 = 0.0; Node205_Float_Export( Output_N204, Export_N205, Globals );
			float Output_N183 = 0.0; Node183_Loop_Triplanar_UV( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), float3( 0.0, 1.0, 0.0 ), float3( 1.0, 1.0, 1.0 ), float3( 0.0, 0.0, 0.0 ), float( 1.0 ), Output_N183, Globals );
			float Export_N184 = 0.0; Node184_Float_Export( Output_N183, Export_N184, Globals );
			float Output_N140 = 0.0; Node140_Multiply( Export_N184, NF_PORT_CONSTANT( float( 1.3 ), Port_Input1_N140 ), Output_N140, Globals );
			float Output_N141 = 0.0; Node141_Pow( Output_N140, NF_PORT_CONSTANT( float( 4.0 ), Port_Input1_N141 ), Output_N141, Globals );
			float Output_N110 = 0.0; Node110_Multiply( Export_N205, Output_N141, NF_PORT_CONSTANT( float( 0.18 ), Port_Input2_N110 ), Output_N110, Globals );
			float3 Normal_N92 = float3(0.0); Node92_Surface_Normal( Normal_N92, Globals );
			float3 Output_N111 = float3(0.0); Node111_Multiply( Output_N110, Normal_N92, Output_N111, Globals );
			float3 Output_N112 = float3(0.0); Node112_Subtract( Position_N88, Output_N111, Output_N112, Globals );
			float3 Output1_N113 = float3(0.0); Node113_Mixer( Position_N88, Output_N112, Output1_N113, Globals );
			float Value1_N114 = 0.0; float Value2_N114 = 0.0; float Value3_N114 = 0.0; float Value4_N114 = 0.0; Node114_Split_Vector( float4( Output1_N113.xyz, 0.0 ), Value1_N114, Value2_N114, Value3_N114, Value4_N114, Globals );
			float Output_N115 = 0.0; Node115_Multiply( Value_N28, Value2_N114, Output_N115, Globals );
			float Output_N116 = 0.0; Node116_Sin( Output_N115, Output_N116, Globals );
			float Output_N117 = 0.0; Node117_Divide( Export_N205, NF_PORT_CONSTANT( float( 20.0 ), Port_Input1_N117 ), Output_N117, Globals );
			float Output_N118 = 0.0; Node118_Multiply( Output_N116, Output_N117, Output_N118, Globals );
			float Output_N119 = 0.0; Node119_Add( Output_N118, Value1_N114, Output_N119, Globals );
			float4 Value_N120 = float4(0.0); Node120_Construct_Vector( Output_N119, Value2_N114, Value3_N114, Value4_N114, Value_N120, Globals );
			
			Input1 = Value_N120.xyz;
		}
		Output = Input1; 
	} 
	else 
	{ 
		/* Input port: "Input2"  */
		
		{
			float3 Position_N88 = float3(0.0); Node88_Surface_Position( Position_N88, Globals );
			
			Input2 = Position_N88;
		}
		Output = Input2; 
	}
}
#define Node11_Transform_Vector( VectorIn, VectorOut, Globals ) VectorOut = ( ngsModelMatrix * float4( VectorIn.xyz, 1.0 ) ).xyz
#define Node123_Float_Export( Value, Export, Globals ) Export = Value
#define Node80_Surface_Position( Position, Globals ) Position = Globals.SurfacePosition_WorldSpace
void Node130_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N130 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
void Node42_Float_Parameter( out float Output, ssGlobals Globals ) { Output = thickLines; }
void Node15_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( animated )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
void Node68_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N68 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
void Node5_Float_Parameter( out float Output, ssGlobals Globals ) { Output = scanlineSpeed; }
#define Node63_Remap( ValueIn, ValueOut, RangeMinA, RangeMaxA, RangeMinB, RangeMaxB, Globals ) ValueOut = ( ( ValueIn - RangeMinA ) / ( RangeMaxA - RangeMinA + SC_EPSILON ) ) * ( RangeMaxB - RangeMinB ) + RangeMinB
#define Node43_One_Minus( Input0, Output, Globals ) Output = 1.0 - Input0
void Node64_Conditional( in float Input0, in float Input1, in float Input2, out float Output, ssGlobals Globals )
{ 
	#if 0
	/* Input port: "Input0"  */
	
	{
		float Output_N68 = 0.0; Node68_Bool_Parameter( Output_N68, Globals );
		
		Input0 = Output_N68;
	}
	#endif
	
	if ( bool( Tweak_N68 ) ) 
	{ 
		/* Input port: "Input1"  */
		
		{
			float Output_N5 = 0.0; Node5_Float_Parameter( Output_N5, Globals );
			float ValueOut_N63 = 0.0; Node63_Remap( Output_N5, ValueOut_N63, NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinA_N063 ), NF_PORT_CONSTANT( float( 1.0 ), Port_RangeMaxA_N063 ), NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinB_N063 ), NF_PORT_CONSTANT( float( 20.0 ), Port_RangeMaxB_N063 ), Globals );
			float Output_N43 = 0.0; Node43_One_Minus( ValueOut_N63, Output_N43, Globals );
			
			Input1 = Output_N43;
		}
		Output = Input1; 
	} 
	else 
	{ 
		/* Input port: "Input2"  */
		
		{
			float Output_N5 = 0.0; Node5_Float_Parameter( Output_N5, Globals );
			float ValueOut_N63 = 0.0; Node63_Remap( Output_N5, ValueOut_N63, NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinA_N063 ), NF_PORT_CONSTANT( float( 1.0 ), Port_RangeMaxA_N063 ), NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinB_N063 ), NF_PORT_CONSTANT( float( 20.0 ), Port_RangeMaxB_N063 ), Globals );
			
			Input2 = ValueOut_N63;
		}
		Output = Input2; 
	}
}
#define Node30_Elapsed_Time( Multiplier, Time, Globals ) Time = Globals.gTimeElapsed * Multiplier
void Node27_Float_Parameter( out float Output, ssGlobals Globals ) { Output = Offset; }
#define Node67_Remap( ValueIn, ValueOut, RangeMinA, RangeMaxA, RangeMinB, RangeMaxB, Globals ) ValueOut = ( ( ValueIn - RangeMinA ) / ( RangeMaxA - RangeMinA + SC_EPSILON ) ) * ( RangeMaxB - RangeMinB ) + RangeMinB
#define Node29_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
void Node10_If_else( in float Bool1, in float Value1, in float Default, out float Result, ssGlobals Globals )
{ 
	if ( bool( animated ) )
	{
		/* Input port: "Value1"  */
		
		{
			float Output_N64 = 0.0; Node64_Conditional( float( 1.0 ), float( 1.0 ), float( 0.0 ), Output_N64, Globals );
			float Time_N30 = 0.0; Node30_Elapsed_Time( Output_N64, Time_N30, Globals );
			float Output_N27 = 0.0; Node27_Float_Parameter( Output_N27, Globals );
			float ValueOut_N67 = 0.0; Node67_Remap( Output_N27, ValueOut_N67, NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinA_N067 ), NF_PORT_CONSTANT( float( 1.0 ), Port_RangeMaxA_N067 ), NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinB_N067 ), NF_PORT_CONSTANT( float( 100.0 ), Port_RangeMaxB_N067 ), Globals );
			float Output_N29 = 0.0; Node29_Add( Time_N30, ValueOut_N67, Output_N29, Globals );
			
			Value1 = Output_N29;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float Output_N27 = 0.0; Node27_Float_Parameter( Output_N27, Globals );
			float ValueOut_N67 = 0.0; Node67_Remap( Output_N27, ValueOut_N67, NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinA_N067 ), NF_PORT_CONSTANT( float( 1.0 ), Port_RangeMaxA_N067 ), NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinB_N067 ), NF_PORT_CONSTANT( float( 100.0 ), Port_RangeMaxB_N067 ), Globals );
			
			Default = ValueOut_N67;
		}
		Result = Default;
	}
}
void Node89_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N89 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node0_Screen_UV_Coord( ScreenCoord, Globals ) ScreenCoord = Globals.gScreenCoord
#define Node78_Divide( Input0, Input1, Output, Globals ) Output = Input0 / (float2(Input1) + 1.234e-6)
#define Node62_Surface_Position( Position, Globals ) Position = Globals.SurfacePosition_ObjectSpace
void Node86_Conditional( in float Input0, in float2 Input1, in float2 Input2, out float2 Output, ssGlobals Globals )
{ 
	#if 0
	/* Input port: "Input0"  */
	
	{
		float Output_N89 = 0.0; Node89_Bool_Parameter( Output_N89, Globals );
		
		Input0 = Output_N89;
	}
	#endif
	
	if ( bool( Tweak_N89 ) ) 
	{ 
		/* Input port: "Input1"  */
		
		{
			float2 ScreenCoord_N0 = float2(0.0); Node0_Screen_UV_Coord( ScreenCoord_N0, Globals );
			float2 Output_N78 = float2(0.0); Node78_Divide( ScreenCoord_N0, NF_PORT_CONSTANT( float( 0.002 ), Port_Input1_N078 ), Output_N78, Globals );
			
			Input1 = Output_N78;
		}
		Output = Input1; 
	} 
	else 
	{ 
		/* Input port: "Input2"  */
		
		{
			float3 Position_N62 = float3(0.0); Node62_Surface_Position( Position_N62, Globals );
			
			Input2 = Position_N62.xy;
		}
		Output = Input2; 
	}
}
#define Node16_Swizzle( Input, Output, Globals ) Output = Input.y
#define Node17_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - Input1
#define Node46_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node18_Fract( Input0, Output, Globals ) Output = fract( Input0 )
void Node79_Float_Parameter( out float Output, ssGlobals Globals ) { Output = randScale; }
#define Node129_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - Input1
#define Node81_One_Minus( Input0, Output, Globals ) Output = 1.0 - Input0
#define Node74_Is_Less( Input0, Input1, Output, Globals ) Output = ssSmaller( Input0, Input1 )
#define Node70_Float_Import( Import, Value, Globals ) Value = Import
#define Node69_Float_Import( Import, Value, Globals ) Value = Import
#define Node71_Float_Import( Import, Value, Globals ) Value = Import
#define Node72_Clamp( Input0, Input1, Input2, Output, Globals ) Output = clamp( Input0 + 0.001, Input1 + 0.001, Input2 + 0.001 ) - 0.001
#define Node90_Surface_Position( Position, Globals ) Position = Globals.SurfacePosition_ObjectSpace
#define Node94_Float_Import( Import, Value, Globals ) Value = Import
#define Node95_AABB_Max( AABBMax, Globals ) AABBMax = ngsLocalAabbMax
#define Node96_AABB_Min( AABBMin, Globals ) AABBMin = ngsLocalAabbMin
#define Node97_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - Input1
#define Node98_Length( Input0, Output, Globals ) Output = length( Input0 )
#define Node99_Divide( Input0, Input1, Output, Globals ) Output = Input0 / (float3(Input1) + 1.234e-6)
#define Node100_Float_Export( Value, Export, Globals ) Export = Value
#define Node106_Float_Import( Import, Value, Globals ) Value = max( Import, 0.0 )
#define Node107_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * float3(Input1)
#define Node143_Surface_Normal( Normal, Globals ) Normal = Globals.VertexNormal_ObjectSpace
#define Node7_Triplanar_UV_Coord( Coords, Globals ) Coords = Globals.gTriplanarCoords
void Node41_Noise_Simplex( in float2 Seed, in float2 Scale, out float Noise, ssGlobals Globals )
{ 
	ssPRECISION_LIMITER( Seed.x )
	ssPRECISION_LIMITER( Seed.y )
	Seed *= Scale * 0.5;
	Noise = snoise( Seed ) * 0.5 + 0.5;
	ssPRECISION_LIMITER( Noise );
}
void Node77_Loop_Triplanar_UV( in float Input, in float3 Position, in float3 Normal, in float3 Scale, in float3 Offset, in float Sharpness, out float Output, ssGlobals Globals )
{ 
	/* Input port: "Scale"  */
	
	{
		float Output_N79 = 0.0; Node79_Float_Parameter( Output_N79, Globals );
		float Output_N129 = 0.0; Node129_Subtract( NF_PORT_CONSTANT( float( 1.1 ), Port_Input0_N129 ), Output_N79, Output_N129, Globals );
		float3 Value_N70 = float3(0.0); Node70_Float_Import( float3( Output_N129 ), Value_N70, Globals );
		
		Scale = Value_N70;
	}
	/* Input port: "Offset"  */
	
	{
		float Result_N105 = 0.0; Node105_If_else( float( 0.0 ), float( 0.0 ), float( 0.0 ), Result_N105, Globals );
		float3 Value_N69 = float3(0.0); Node69_Float_Import( float3( Result_N105 ), Value_N69, Globals );
		
		Offset = Value_N69;
	}
	/* Input port: "Sharpness"  */
	
	{
		float Value_N71 = 0.0; Node71_Float_Import( NF_PORT_CONSTANT( float( 0.5 ), Port_Import_N071 ), Value_N71, Globals );
		float Output_N72 = 0.0; Node72_Clamp( Value_N71, NF_PORT_CONSTANT( float( 0.0 ), Port_Input1_N072 ), NF_PORT_CONSTANT( float( 1.0 ), Port_Input2_N072 ), Output_N72, Globals );
		
		Sharpness = Output_N72;
	}
	/* Input port: "Position"  */
	
	{
		float3 Position_N90 = float3(0.0); Node90_Surface_Position( Position_N90, Globals );
		float3 Value_N94 = float3(0.0); Node94_Float_Import( Position_N90, Value_N94, Globals );
		float3 AABBMax_N95 = float3(0.0); Node95_AABB_Max( AABBMax_N95, Globals );
		float3 AABBMin_N96 = float3(0.0); Node96_AABB_Min( AABBMin_N96, Globals );
		float3 Output_N97 = float3(0.0); Node97_Subtract( AABBMax_N95, AABBMin_N96, Output_N97, Globals );
		float Output_N98 = 0.0; Node98_Length( Output_N97, Output_N98, Globals );
		float3 Output_N99 = float3(0.0); Node99_Divide( Value_N94, Output_N98, Output_N99, Globals );
		float3 Export_N100 = float3(0.0); Node100_Float_Export( Output_N99, Export_N100, Globals );
		float Value_N106 = 0.0; Node106_Float_Import( NF_PORT_CONSTANT( float( 20.0 ), Port_Import_N106 ), Value_N106, Globals );
		float3 Output_N107 = float3(0.0); Node107_Multiply( Export_N100, Value_N106, Output_N107, Globals );
		
		Position = Output_N107;
	}
	/* Input port: "Normal"  */
	
	{
		float3 Normal_N143 = float3(0.0); Node143_Surface_Normal( Normal_N143, Globals );
		
		Normal = Normal_N143;
	}
	
	vec3 p = Position;
	vec3 n = Normal;
	
	p += Offset;
	p *= Scale;
	
	n = abs(n);
	
	// determine major axis (in x; yz are following axis)
	
	ivec3 ma = ( n.x > n.y && n.x > n.z ) ? ivec3( 0, 1, 2 ) : ( n.y > n.z ) ? ivec3( 1, 2, 0 ) : ivec3( 2, 0, 1 );
	
	// determine minor axis (in x; yz are following axis)
	
	ivec3 mi = ( n.x < n.y && n.x < n.z ) ? ivec3( 0, 1, 2 ) : ( n.y < n.z ) ? ivec3( 1, 2, 0 ) : ivec3( 2, 0, 1 );
	
	// determine median axis (in x;  yz are following axis)
	
	ivec3 me = ivec3( 3 ) - mi - ma;
	
	// project + fetch
	
	Globals.gTriplanarCoords = vec2( p[ma.y], p[ma.z]);
	/* Input port: "Input"  */
	
	{
		float2 Coords_N7 = float2(0.0); Node7_Triplanar_UV_Coord( Coords_N7, Globals );
		float Noise_N41 = 0.0; Node41_Noise_Simplex( Coords_N7, NF_PORT_CONSTANT( float2( 1.0, 1.0 ), Port_Scale_N041 ), Noise_N41, Globals );
		
		Input = Noise_N41;
	}
	float x = Input;
	
	Globals.gTriplanarCoords = vec2( p[me.y], p[me.z]);
	/* Input port: "Input"  */
	
	{
		float2 Coords_N7 = float2(0.0); Node7_Triplanar_UV_Coord( Coords_N7, Globals );
		float Noise_N41 = 0.0; Node41_Noise_Simplex( Coords_N7, NF_PORT_CONSTANT( float2( 1.0, 1.0 ), Port_Scale_N041 ), Noise_N41, Globals );
		
		Input = Noise_N41;
	}
	float y = Input;
	
	// blend factors
	
	vec2 w = vec2( n[ma.x], n[me.x] );
	
	// make local support
	
	//w = clamp( ( w - 0.5773 ) / ( 1.0 - 0.5773 ), 0.0, 1.0 );
	
	// shape transition
	
	w = pow( w, vec2( 1.0 / ( 1.0 - Sharpness * 0.99 ) ) );
	
	// blend and return
	
	Output = ( x*w.x + y*w.y ) / ( w.x + w.y );
}
#define Node83_Float_Export( Value, Export, Globals ) Export = Value
#define Node122_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node125_Pow( Input0, Input1, Output, Globals ) Output = ( Input0 <= 0.0 ) ? 0.0 : pow( Input0, Input1 )
#define Node85_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node126_Clamp( Input0, Input1, Input2, Output, Globals ) Output = clamp( Input0 + 0.001, Input1 + 0.001, Input2 + 0.001 ) - 0.001
#define Node127_One_Minus( Input0, Output, Globals ) Output = 1.0 - Input0
void Node128_Conditional( in float Input0, in float Input1, in float Input2, out float Output, ssGlobals Globals )
{ 
	#if 0
	/* Input port: "Input0"  */
	
	{
		float Output_N130 = 0.0; Node130_Bool_Parameter( Output_N130, Globals );
		
		Input0 = Output_N130;
	}
	#endif
	
	if ( bool( Tweak_N130 ) ) 
	{ 
		/* Input port: "Input1"  */
		
		{
			float Output_N42 = 0.0; Node42_Float_Parameter( Output_N42, Globals );
			float Result_N10 = 0.0; Node10_If_else( float( 0.0 ), float( 0.0 ), float( 0.0 ), Result_N10, Globals );
			float2 Output_N86 = float2(0.0); Node86_Conditional( float( 1.0 ), float2( 1.0, 1.0 ), float2( 0.0, 0.0 ), Output_N86, Globals );
			float Output_N16 = 0.0; Node16_Swizzle( Output_N86, Output_N16, Globals );
			float Output_N17 = 0.0; Node17_Subtract( Result_N10, Output_N16, Output_N17, Globals );
			float Output_N46 = 0.0; Node46_Multiply( Output_N42, Output_N17, Output_N46, Globals );
			float Output_N18 = 0.0; Node18_Fract( Output_N46, Output_N18, Globals );
			float Output_N79 = 0.0; Node79_Float_Parameter( Output_N79, Globals );
			float Output_N129 = 0.0; Node129_Subtract( NF_PORT_CONSTANT( float( 1.1 ), Port_Input0_N129 ), Output_N79, Output_N129, Globals );
			float Output_N81 = 0.0; Node81_One_Minus( Output_N129, Output_N81, Globals );
			float Output_N74 = 0.0; Node74_Is_Less( Output_N18, Output_N81, Output_N74, Globals );
			float Output_N77 = 0.0; Node77_Loop_Triplanar_UV( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), float3( 0.0, 1.0, 0.0 ), float3( 1.0, 1.0, 1.0 ), float3( 0.0, 0.0, 0.0 ), float( 1.0 ), Output_N77, Globals );
			float Export_N83 = 0.0; Node83_Float_Export( Output_N77, Export_N83, Globals );
			float Output_N122 = 0.0; Node122_Multiply( Export_N83, NF_PORT_CONSTANT( float( 1.3 ), Port_Input1_N122 ), Output_N122, Globals );
			float Output_N125 = 0.0; Node125_Pow( Output_N122, NF_PORT_CONSTANT( float( 4.0 ), Port_Input1_N125 ), Output_N125, Globals );
			float Output_N85 = 0.0; Node85_Multiply( Output_N74, Output_N125, Output_N85, Globals );
			float Output_N126 = 0.0; Node126_Clamp( Output_N85, NF_PORT_CONSTANT( float( 0.0 ), Port_Input1_N126 ), NF_PORT_CONSTANT( float( 1.0 ), Port_Input2_N126 ), Output_N126, Globals );
			
			Input1 = Output_N126;
		}
		Output = Input1; 
	} 
	else 
	{ 
		/* Input port: "Input2"  */
		
		{
			float Output_N42 = 0.0; Node42_Float_Parameter( Output_N42, Globals );
			float Result_N10 = 0.0; Node10_If_else( float( 0.0 ), float( 0.0 ), float( 0.0 ), Result_N10, Globals );
			float2 Output_N86 = float2(0.0); Node86_Conditional( float( 1.0 ), float2( 1.0, 1.0 ), float2( 0.0, 0.0 ), Output_N86, Globals );
			float Output_N16 = 0.0; Node16_Swizzle( Output_N86, Output_N16, Globals );
			float Output_N17 = 0.0; Node17_Subtract( Result_N10, Output_N16, Output_N17, Globals );
			float Output_N46 = 0.0; Node46_Multiply( Output_N42, Output_N17, Output_N46, Globals );
			float Output_N18 = 0.0; Node18_Fract( Output_N46, Output_N18, Globals );
			float Output_N79 = 0.0; Node79_Float_Parameter( Output_N79, Globals );
			float Output_N129 = 0.0; Node129_Subtract( NF_PORT_CONSTANT( float( 1.1 ), Port_Input0_N129 ), Output_N79, Output_N129, Globals );
			float Output_N81 = 0.0; Node81_One_Minus( Output_N129, Output_N81, Globals );
			float Output_N74 = 0.0; Node74_Is_Less( Output_N18, Output_N81, Output_N74, Globals );
			float Output_N77 = 0.0; Node77_Loop_Triplanar_UV( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), float3( 0.0, 1.0, 0.0 ), float3( 1.0, 1.0, 1.0 ), float3( 0.0, 0.0, 0.0 ), float( 1.0 ), Output_N77, Globals );
			float Export_N83 = 0.0; Node83_Float_Export( Output_N77, Export_N83, Globals );
			float Output_N122 = 0.0; Node122_Multiply( Export_N83, NF_PORT_CONSTANT( float( 1.3 ), Port_Input1_N122 ), Output_N122, Globals );
			float Output_N125 = 0.0; Node125_Pow( Output_N122, NF_PORT_CONSTANT( float( 4.0 ), Port_Input1_N125 ), Output_N125, Globals );
			float Output_N85 = 0.0; Node85_Multiply( Output_N74, Output_N125, Output_N85, Globals );
			float Output_N126 = 0.0; Node126_Clamp( Output_N85, NF_PORT_CONSTANT( float( 0.0 ), Port_Input1_N126 ), NF_PORT_CONSTANT( float( 1.0 ), Port_Input2_N126 ), Output_N126, Globals );
			float Output_N127 = 0.0; Node127_One_Minus( Output_N126, Output_N127, Globals );
			
			Input2 = Output_N127;
		}
		Output = Input2; 
	}
}
#define Node73_Mix( Input0, Input1, Input2, Output, Globals ) Output = mix( Input0, Input1, float3(Input2) )
void Node40_If_else( in float Bool1, in float3 Value1, in float Bool2, in float3 Value2, in float3 Default, out float3 Result, ssGlobals Globals )
{ 
	if ( bool( ( bool( Tweak_N75 ) && bool( Tweak_N76 ) ) ) )
	{
		/* Input port: "Value1"  */
		
		{
			float3 Output_N121 = float3(0.0); Node121_Conditional( float( 0.0 ), float3( 1.0, 1.0, 1.0 ), float3( 0.0, 0.0, 0.0 ), Output_N121, Globals );
			float3 VectorOut_N11 = float3(0.0); Node11_Transform_Vector( Output_N121, VectorOut_N11, Globals );
			float3 Export_N123 = float3(0.0); Node123_Float_Export( VectorOut_N11, Export_N123, Globals );
			float3 Position_N80 = float3(0.0); Node80_Surface_Position( Position_N80, Globals );
			float Output_N128 = 0.0; Node128_Conditional( float( 1.0 ), float( 1.0 ), float( 0.0 ), Output_N128, Globals );
			float3 Output_N73 = float3(0.0); Node73_Mix( Export_N123, Position_N80, Output_N128, Output_N73, Globals );
			
			Value1 = Output_N73;
		}
		Result = Value1;
	}
	
	else if ( bool( Tweak_N76 ) )
	{
		/* Input port: "Value2"  */
		
		{
			float3 Output_N121 = float3(0.0); Node121_Conditional( float( 0.0 ), float3( 1.0, 1.0, 1.0 ), float3( 0.0, 0.0, 0.0 ), Output_N121, Globals );
			float3 VectorOut_N11 = float3(0.0); Node11_Transform_Vector( Output_N121, VectorOut_N11, Globals );
			float3 Export_N123 = float3(0.0); Node123_Float_Export( VectorOut_N11, Export_N123, Globals );
			
			Value2 = Export_N123;
		}
		Result = Value2;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float3 Position_N80 = float3(0.0); Node80_Surface_Position( Position_N80, Globals );
			
			Default = Position_N80;
		}
		Result = Default;
	}
}

//-----------------------------------------------------------------------

void main() 
{
	
	
	NF_SETUP_PREVIEW_VERTEX()
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	sc_Vertex_t v;
	ngsVertexShaderBegin( v );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	ssGlobals Globals;	
	Globals.gTimeElapsed = sc_TimeElapsed;
	Globals.gTimeDelta   = sc_TimeDelta;
	Globals.SurfacePosition_ObjectSpace = ( ngsModelMatrixInverse * float4( varPos, 1.0 ) ).xyz;
	Globals.VertexNormal_WorldSpace     = varNormal;
	Globals.VertexNormal_ObjectSpace    = normalize( ( ngsModelMatrixInverse * float4( Globals.VertexNormal_WorldSpace, 0.0 ) ).xyz );
	Globals.gTriplanarCoords            = vec2( 0.0 );
	Globals.SurfacePosition_WorldSpace  = varPos;
	
	#ifdef                              VERTEX_SHADER
	
	float4                              Result = ngsViewProjectionMatrix * float4( varPos, 1.0 );
	Result.xyz                          /= Result.w; /* map from clip space to NDC space. keep w around so we can re-project back to world*/
	Globals.gScreenCoord                = Result.xy * 0.5 + 0.5;
	
	#else
	
	Globals.gScreenCoord                = getScreenUV().xy;
	
	#endif
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	float4 ScreenPosition = vec4( 0.0 );
	float3 WorldPosition  = varPos;
	float3 WorldNormal    = varNormal;
	float3 WorldTangent   = varTangent.xyz;
	float3 PrevWorldPosition  = vec3(0);
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	/* Input port: 'WorldPosition'  */
	
	{
		float3 Result_N40 = float3(0.0); Node40_If_else( float( 0.0 ), float3( 0.0, 0.0, 0.0 ), float( 0.0 ), float3( 0.0, 0.0, 0.0 ), float3( 0.0, 0.0, 0.0 ), Result_N40, Globals );
		
		WorldPosition = Result_N40;
	}
	
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

// Globals

struct ssGlobals
{
	float gTimeElapsed;
	float gTimeDelta;
	float gTimeElapsedShifted;
	
	float2 gScreenCoord;
	float3 SurfacePosition_ObjectSpace;
	float3 ViewDirWS;
	float3 SurfacePosition_WorldSpace;
	float3 VertexNormal_WorldSpace;
	float2 Surface_UVCoord0;
};

ssGlobals tempGlobals;
#define scCustomCodeUniform	

//----------

// Functions

void Node21_Color_Parameter( out float4 Output, ssGlobals Globals ) { Output = thicklinesColor; }
void Node42_Float_Parameter( out float Output, ssGlobals Globals ) { Output = thickLines; }
void Node15_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( animated )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
void Node68_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N68 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
void Node5_Float_Parameter( out float Output, ssGlobals Globals ) { Output = scanlineSpeed; }
#define Node63_Remap( ValueIn, ValueOut, RangeMinA, RangeMaxA, RangeMinB, RangeMaxB, Globals ) ValueOut = ( ( ValueIn - RangeMinA ) / ( RangeMaxA - RangeMinA + SC_EPSILON ) ) * ( RangeMaxB - RangeMinB ) + RangeMinB
#define Node43_One_Minus( Input0, Output, Globals ) Output = 1.0 - Input0
void Node64_Conditional( in float Input0, in float Input1, in float Input2, out float Output, ssGlobals Globals )
{ 
	#if 0
	/* Input port: "Input0"  */
	
	{
		float Output_N68 = 0.0; Node68_Bool_Parameter( Output_N68, Globals );
		
		Input0 = Output_N68;
	}
	#endif
	
	if ( bool( Tweak_N68 ) ) 
	{ 
		/* Input port: "Input1"  */
		
		{
			float Output_N5 = 0.0; Node5_Float_Parameter( Output_N5, Globals );
			float ValueOut_N63 = 0.0; Node63_Remap( Output_N5, ValueOut_N63, NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinA_N063 ), NF_PORT_CONSTANT( float( 1.0 ), Port_RangeMaxA_N063 ), NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinB_N063 ), NF_PORT_CONSTANT( float( 20.0 ), Port_RangeMaxB_N063 ), Globals );
			float Output_N43 = 0.0; Node43_One_Minus( ValueOut_N63, Output_N43, Globals );
			
			Input1 = Output_N43;
		}
		Output = Input1; 
	} 
	else 
	{ 
		/* Input port: "Input2"  */
		
		{
			float Output_N5 = 0.0; Node5_Float_Parameter( Output_N5, Globals );
			float ValueOut_N63 = 0.0; Node63_Remap( Output_N5, ValueOut_N63, NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinA_N063 ), NF_PORT_CONSTANT( float( 1.0 ), Port_RangeMaxA_N063 ), NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinB_N063 ), NF_PORT_CONSTANT( float( 20.0 ), Port_RangeMaxB_N063 ), Globals );
			
			Input2 = ValueOut_N63;
		}
		Output = Input2; 
	}
}
#define Node30_Elapsed_Time( Multiplier, Time, Globals ) Time = Globals.gTimeElapsed * Multiplier
void Node27_Float_Parameter( out float Output, ssGlobals Globals ) { Output = Offset; }
#define Node67_Remap( ValueIn, ValueOut, RangeMinA, RangeMaxA, RangeMinB, RangeMaxB, Globals ) ValueOut = ( ( ValueIn - RangeMinA ) / ( RangeMaxA - RangeMinA + SC_EPSILON ) ) * ( RangeMaxB - RangeMinB ) + RangeMinB
#define Node29_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
void Node10_If_else( in float Bool1, in float Value1, in float Default, out float Result, ssGlobals Globals )
{ 
	if ( bool( animated ) )
	{
		/* Input port: "Value1"  */
		
		{
			float Output_N64 = 0.0; Node64_Conditional( float( 1.0 ), float( 1.0 ), float( 0.0 ), Output_N64, Globals );
			float Time_N30 = 0.0; Node30_Elapsed_Time( Output_N64, Time_N30, Globals );
			float Output_N27 = 0.0; Node27_Float_Parameter( Output_N27, Globals );
			float ValueOut_N67 = 0.0; Node67_Remap( Output_N27, ValueOut_N67, NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinA_N067 ), NF_PORT_CONSTANT( float( 1.0 ), Port_RangeMaxA_N067 ), NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinB_N067 ), NF_PORT_CONSTANT( float( 100.0 ), Port_RangeMaxB_N067 ), Globals );
			float Output_N29 = 0.0; Node29_Add( Time_N30, ValueOut_N67, Output_N29, Globals );
			
			Value1 = Output_N29;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float Output_N27 = 0.0; Node27_Float_Parameter( Output_N27, Globals );
			float ValueOut_N67 = 0.0; Node67_Remap( Output_N27, ValueOut_N67, NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinA_N067 ), NF_PORT_CONSTANT( float( 1.0 ), Port_RangeMaxA_N067 ), NF_PORT_CONSTANT( float( 0.0 ), Port_RangeMinB_N067 ), NF_PORT_CONSTANT( float( 100.0 ), Port_RangeMaxB_N067 ), Globals );
			
			Default = ValueOut_N67;
		}
		Result = Default;
	}
}
void Node89_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N89 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node0_Screen_UV_Coord( ScreenCoord, Globals ) ScreenCoord = Globals.gScreenCoord
#define Node78_Divide( Input0, Input1, Output, Globals ) Output = Input0 / (float2(Input1) + 1.234e-6)
#define Node62_Surface_Position( Position, Globals ) Position = Globals.SurfacePosition_ObjectSpace
void Node86_Conditional( in float Input0, in float2 Input1, in float2 Input2, out float2 Output, ssGlobals Globals )
{ 
	#if 0
	/* Input port: "Input0"  */
	
	{
		float Output_N89 = 0.0; Node89_Bool_Parameter( Output_N89, Globals );
		
		Input0 = Output_N89;
	}
	#endif
	
	if ( bool( Tweak_N89 ) ) 
	{ 
		/* Input port: "Input1"  */
		
		{
			float2 ScreenCoord_N0 = float2(0.0); Node0_Screen_UV_Coord( ScreenCoord_N0, Globals );
			float2 Output_N78 = float2(0.0); Node78_Divide( ScreenCoord_N0, NF_PORT_CONSTANT( float( 0.002 ), Port_Input1_N078 ), Output_N78, Globals );
			
			Input1 = Output_N78;
		}
		Output = Input1; 
	} 
	else 
	{ 
		/* Input port: "Input2"  */
		
		{
			float3 Position_N62 = float3(0.0); Node62_Surface_Position( Position_N62, Globals );
			
			Input2 = Position_N62.xy;
		}
		Output = Input2; 
	}
}
#define Node16_Swizzle( Input, Output, Globals ) Output = Input.y
#define Node17_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - Input1
#define Node46_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node18_Fract( Input0, Output, Globals ) Output = fract( Input0 )
#define Node20_Multiply( Input0, Input1, Input2, Output, Globals ) Output = Input0 * float4(Input1) * float4(Input2)
void Node44_Float_Parameter( out float Output, ssGlobals Globals ) { Output = thinLines; }
#define Node51_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node47_Fract( Input0, Output, Globals ) Output = fract( Input0 )
void Node48_Color_Parameter( out float4 Output, ssGlobals Globals ) { Output = thinlinesColor; }
#define Node49_Multiply( Input0, Input1, Input2, Output, Globals ) Output = float4(Input0) * float4(Input1) * Input2
#define Node23_Camera_Facing_Ratio( Ratio, Globals ) Ratio = 1.0 - saturate( dot( Globals.ViewDirWS, Globals.VertexNormal_WorldSpace ) )
void Node25_Color_Parameter( out float4 Output, ssGlobals Globals ) { Output = rimTint; }
#define Node24_Multiply( Input0, Input1, Output, Globals ) Output = float4(Input0) * Input1
#define Node22_Add( Input0, Input1, Input2, Output, Globals ) Output = Input0 + Input1 + Input2
#define Node61_Swizzle( Input, Output, Globals ) Output = Input.a
void Node12_Bool_Parameter( out float Output, ssGlobals Globals )
{ 
	if ( Tweak_N12 )
	{
		Output = 1.001;
	}
	else
	{
		Output = 0.001;
	}
	
	Output -= 0.001; // LOOK-62828
}
#define Node13_Texture_2D_Parameter( Output, Globals ) Output = SC_SAMPLE_TEX_R(opacityTexture, Globals.Surface_UVCoord0, 0.0)
void Node14_Conditional( in float Input0, in float4 Input1, in float Input2, out float4 Output, ssGlobals Globals )
{ 
	#if 0
	/* Input port: "Input0"  */
	
	{
		float Output_N12 = 0.0; Node12_Bool_Parameter( Output_N12, Globals );
		
		Input0 = Output_N12;
	}
	#endif
	
	if ( bool( Tweak_N12 ) ) 
	{ 
		/* Input port: "Input1"  */
		
		{
			float4 Output_N13 = float4(0.0); Node13_Texture_2D_Parameter( Output_N13, Globals );
			
			Input1 = Output_N13;
		}
		Output = Input1; 
	} 
	else 
	{ 
		
		Output = float4(Input2); 
	}
}
#define Node26_Swizzle( Input, Output, Globals ) Output = Input
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
	
	
	sc_DiscardStereoFragment();
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	NF_SETUP_PREVIEW_PIXEL()
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	float4 FinalColor = float4( 1.0, 1.0, 1.0, 1.0 );
	
	
	
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	ssGlobals Globals;	
	Globals.gTimeElapsed = sc_TimeElapsed;
	Globals.gTimeDelta   = sc_TimeDelta;
	
	
	{
		#ifdef                              VERTEX_SHADER
		
		float4                              Result = ngsViewProjectionMatrix * float4( varPos, 1.0 );
		Result.xyz                          /= Result.w; /* map from clip space to NDC space. keep w around so we can re-project back to world*/
		Globals.gScreenCoord                = Result.xy * 0.5 + 0.5;
		
		#else
		
		Globals.gScreenCoord                = getScreenUV().xy;
		
		#endif
		
		Globals.SurfacePosition_ObjectSpace = ( ngsModelMatrixInverse * float4( varPos, 1.0 ) ).xyz;
		Globals.SurfacePosition_WorldSpace  = varPos;
		Globals.ViewDirWS                   = normalize( ngsCameraPosition - Globals.SurfacePosition_WorldSpace );
		Globals.VertexNormal_WorldSpace     = normalize( varNormal );
		Globals.Surface_UVCoord0            = varTex01.xy;
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	/* Input port: 'FinalColor'  */
	
	{
		float4 Output_N21 = float4(0.0); Node21_Color_Parameter( Output_N21, Globals );
		float Output_N42 = 0.0; Node42_Float_Parameter( Output_N42, Globals );
		float Result_N10 = 0.0; Node10_If_else( float( 0.0 ), float( 0.0 ), float( 0.0 ), Result_N10, Globals );
		float2 Output_N86 = float2(0.0); Node86_Conditional( float( 1.0 ), float2( 1.0, 1.0 ), float2( 0.0, 0.0 ), Output_N86, Globals );
		float Output_N16 = 0.0; Node16_Swizzle( Output_N86, Output_N16, Globals );
		float Output_N17 = 0.0; Node17_Subtract( Result_N10, Output_N16, Output_N17, Globals );
		float Output_N46 = 0.0; Node46_Multiply( Output_N42, Output_N17, Output_N46, Globals );
		float Output_N18 = 0.0; Node18_Fract( Output_N46, Output_N18, Globals );
		float4 Output_N20 = float4(0.0); Node20_Multiply( Output_N21, NF_PORT_CONSTANT( float( 0.4 ), Port_Input1_N020 ), Output_N18, Output_N20, Globals );
		float Output_N44 = 0.0; Node44_Float_Parameter( Output_N44, Globals );
		float Output_N51 = 0.0; Node51_Multiply( Output_N16, Output_N44, Output_N51, Globals );
		float Output_N47 = 0.0; Node47_Fract( Output_N51, Output_N47, Globals );
		float4 Output_N48 = float4(0.0); Node48_Color_Parameter( Output_N48, Globals );
		float4 Output_N49 = float4(0.0); Node49_Multiply( Output_N47, NF_PORT_CONSTANT( float( 0.4 ), Port_Input1_N049 ), Output_N48, Output_N49, Globals );
		float Ratio_N23 = 0.0; Node23_Camera_Facing_Ratio( Ratio_N23, Globals );
		float4 Output_N25 = float4(0.0); Node25_Color_Parameter( Output_N25, Globals );
		float4 Output_N24 = float4(0.0); Node24_Multiply( Ratio_N23, Output_N25, Output_N24, Globals );
		float4 Output_N22 = float4(0.0); Node22_Add( Output_N20, Output_N49, Output_N24, Output_N22, Globals );
		float Output_N61 = 0.0; Node61_Swizzle( Output_N22, Output_N61, Globals );
		float4 Output_N14 = float4(0.0); Node14_Conditional( float( 1.0 ), float4( 1.0, 1.0, 1.0, 1.0 ), NF_PORT_CONSTANT( float( 1.0 ), Port_Input2_N014 ), Output_N14, Globals );
		float Output_N26 = 0.0; Node26_Swizzle( Output_N14.x, Output_N26, Globals );
		float Output_N57 = 0.0; Node57_Multiply( Output_N61, Output_N26, Output_N57, Globals );
		float Output_N58 = 0.0; Node58_Clamp( Output_N57, NF_PORT_CONSTANT( float( 0.0 ), Port_Input1_N058 ), NF_PORT_CONSTANT( float( 1.0 ), Port_Input2_N058 ), Output_N58, Globals );
		float4 Value_N60 = float4(0.0); Node60_Construct_Vector( Output_N22.xyz, Output_N58, Value_N60, Globals );
		
		FinalColor = Value_N60;
	}
	ngsAlphaTest( FinalColor.a );
	
	
	
	
	
	
	
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	
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
	
	
}

#endif // #ifdef FRAGMENT_SHADER
