package com.casestudy.twopointzero.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.casestudy.twopointzero.model.HouseholdAppliance;
import com.casestudy.twopointzero.repository.HouseholdApplianceRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RunWith(SpringRunner.class)
@WebMvcTest(HouseholdApplianceController.class)
@Import(HouseholdApplianceController.class)
public class HouseholdApplianceControllerTest {

	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private HouseholdApplianceRepository householdApplianceRepository;
	
	@Autowired
    private ObjectMapper objectMapper;
		
	SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
    Date date = new Date();
	
	@Test
	public void testGetAllHouseholdAppliances() throws Exception {
		
		List<HouseholdAppliance> householdAppliances = new ArrayList<>();
		householdAppliances.add(new HouseholdAppliance("HP", "Envy 15", "983-814-732-667-613", date , "New"));
		householdAppliances.add(new HouseholdAppliance("DELL", "XPS 15", "943-514-732-967-213", date , "New"));
		householdAppliances.add(new HouseholdAppliance("HP", "Envy 17", "283-834-742-667-413", date , "New"));
		householdAppliances.add(new HouseholdAppliance("HP", "Envy 13", "283-834-432-567-673", date , "New"));
		householdAppliances.add(new HouseholdAppliance("DELL", "XPS 13", "923-834-532-667-413", date , "New"));
		householdAppliances.add(new HouseholdAppliance("HP", "Envy 15", "983-814-732-667-613", date , "New"));
		householdAppliances.add(new HouseholdAppliance("DELL", "XPS 15", "943-514-732-967-213", date , "New"));
		householdAppliances.add(new HouseholdAppliance("HP", "Envy 17", "283-834-742-667-413", date , "New"));
		householdAppliances.add(new HouseholdAppliance("HP", "Envy 13", "283-834-432-567-673", date , "New"));
		householdAppliances.add(new HouseholdAppliance("DELL", "XPS 13", "923-834-532-667-413", date , "New"));
		
		Mockito.when(householdApplianceRepository.findAll()).thenReturn(householdAppliances);
		
		String url = "/householdappliances";
		
		MvcResult mvcResult = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();
		
		String actualJsonResponse = mvcResult.getResponse().getContentAsString();
		
		System.out.println(actualJsonResponse);
		
		String expectedJsonResponse = objectMapper.writeValueAsString(householdAppliances);
		
		assertThat(actualJsonResponse).isEqualToIgnoringWhitespace(expectedJsonResponse);
	}
	
//	@Test
//	public void testCreateHouseholdAppliance() throws JsonProcessingException, Exception {
//		
//		HouseholdAppliance newHouseholdAppliance = new HouseholdAppliance("HP", "Envy 15", "983-814-732-667-613", null , "New");
//		HouseholdAppliance createdHouseholdAppliance = new HouseholdAppliance(1, "HP", "Envy 15", "983-814-732-667-613", date , "New");
//		
//		Mockito.when(householdApplianceRepository.save(newHouseholdAppliance)).thenReturn(createdHouseholdAppliance);
//		
//		String url = "/householdappliances";
//		
//		MvcResult result = mockMvc.perform(
//				post(url)
//				.contentType("application/json")
//				.content(objectMapper.writeValueAsString(newHouseholdAppliance))
//				.with(csrf())
//				).andExpect(status().isOk()).andReturn();
//		
//		String content = result.getResponse().getContentAsString();
//		assertThat(content).isEqualToIgnoringWhitespace("1");
//	}
	
//	@Test
//	public void testUpdateHouseholdAppliance() throws JsonProcessingException, Exception {
//		
//		HouseholdAppliance existingHouseholdAppliance = new HouseholdAppliance(1, "HP", "Envy 15", "983-814-732-667-613", date , "Old");
//		HouseholdAppliance updatedHouseholdAppliance = new HouseholdAppliance(1, "HP", "Envy 15", "983-814-732-667-613", date , "Old");
//		
//		Mockito.when(householdApplianceRepository.save(existingHouseholdAppliance)).thenReturn(updatedHouseholdAppliance);
//		
//		String url = "/householdappliances/";
//		
//		MvcResult result = mockMvc.perform(
//				put(url)
//				.contentType("application/json")
//				.content(objectMapper.writeValueAsString(existingHouseholdAppliance))
//				.with(csrf())
//				).andExpect(status().isOk()).andReturn();
//		
//		String content = result.getResponse().getContentAsString();
//		assertThat(content).isEqualToIgnoringWhitespace("1");
//	}
	
//	@Test
//	public void testDeleteHouseholdAppliance() throws Exception {
//		
//		Long householdApplianceId = 33L;
//		
//		Mockito.doNothing().when(householdApplianceRepository).deleteById(householdApplianceId);
//		
//		String url = "/householdappliances/" + householdApplianceId;
//		
//		mockMvc.perform(delete(url)).andExpect(status().isOk());
//		
//		Mockito.verify(householdApplianceRepository, times(1)).deleteById(householdApplianceId);
//		
//	}
	
	
	
}