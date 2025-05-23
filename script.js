const conventions = {
  cdecl: {
    name: "cdecl",
    description: "Arguments passed on stack, right to left. Caller cleans up.",
    registers: [],
    stack: ["arg3", "arg2", "arg1"],
    cleanup: "caller"
  },
  fastcall: {
    name: "fastcall",
    description: "First two args in ECX and EDX, rest on stack. Callee cleans up.",
    registers: ["ECX", "EDX"],
    stack: ["arg3", "arg4"],
    cleanup: "callee"
  },
  stdcall: {
    name: "stdcall",
    description: "All args passed on stack. Callee cleans up.",
    registers: [],
    stack: ["arg3", "arg2", "arg1"],
    cleanup: "callee"
  },
  sysv: {
    name: "System V AMD64",
    description: "First six args in RDI, RSI, RDX, RCX, R8, R9. Caller cleans up.",
    registers: ["RDI", "RSI", "RDX", "RCX", "R8", "R9"],
    stack: [],
    cleanup: "caller"
  },
  ms64: {
    name: "Microsoft x64",
    description: "First four args in RCX, RDX, R8, R9. Rest on stack. Caller cleans up.",
    registers: ["RCX", "RDX", "R8", "R9"],
    stack: ["arg5", "arg6"],
    cleanup: "caller"
  }
};

const quizBank = {
  cdecl: [
    {
      question: "Who is responsible for cleaning the stack?",
      options: ["Callee", "Caller", "Both", "None"],
      answer: "Caller"
    },
    {
      question: "Which order are arguments pushed onto the stack?",
      options: ["Left to right", "Right to left", "Random", "Depends on OS"],
      answer: "Right to left"
    }
  ],
  fastcall: [
    {
      question: "Which registers are used for the first two arguments?",
      options: ["EAX & EBX", "ECX & EDX", "RDI & RSI", "RCX & RDX"],
      answer: "ECX & EDX"
    },
    {
      question: "Who cleans the stack in fastcall?",
      options: ["Caller", "Callee", "Both", "None"],
      answer: "Callee"
    }
  ],
  stdcall: [
    {
      question: "Where are all arguments passed in stdcall?",
      options: ["Registers", "Stack", "Heap", "Cache"],
      answer: "Stack"
    },
    {
      question: "Who is responsible for stack cleanup in stdcall?",
      options: ["Caller", "Callee", "Both", "None"],
      answer: "Callee"
    }
  ],
  sysv: [
    {
      question: "Which register is used for the first argument?",
      options: ["RCX", "RDI", "RAX", "EDX"],
      answer: "RDI"
    },
    {
      question: "How many registers are used before the stack?",
      options: ["4", "5", "6", "8"],
      answer: "6"
    }
  ],
  ms64: [
    {
      question: "How many registers are used for arguments in ms64?",
      options: ["2", "4", "6", "None"],
      answer: "4"
    },
    {
      question: "Which register is used for the second argument?",
      options: ["RCX", "RDX", "R8", "R9"],
      answer: "RDX"
    }
  ]
};

function showConvention() {
  const selected = document.getElementById("conventionSelect").value;
  const vis = document.getElementById("visualization");
  const data = conventions[selected];

  vis.innerHTML = `
    <h2>${data.name}</h2>
    <p>${data.description}</p>
    <div><strong>Registers:</strong> ${
      data.registers.length > 0
        ? data.registers.map(r => `<span class="register animate">${r}</span>`).join("")
        : "None"
    }</div>
    <div><strong>Stack:</strong> ${
      data.stack.length > 0
        ? data.stack.map(s => `<span class="stack animate">${s}</span>`).join("")
        : "None"
    }</div>
    <p><strong>Stack cleanup:</strong> ${data.cleanup}</p>
    <div id="quizArea"></div>
  `;

  showQuiz(selected);
}

function showQuiz(convention) {
  const questions = quizBank[convention];
  const quiz = questions[Math.floor(Math.random() * questions.length)];
  const quizArea = document.getElementById("quizArea");

  quizArea.innerHTML = `
    <h3>Quiz Time!</h3>
    <p>${quiz.question}</p>
    <div id="options">
      ${quiz.options.map(opt => `
        <button onclick="checkAnswer('${opt}', '${quiz.answer}', this)">${opt}</button>
      `).join("")}
    </div>
    <p id="feedback"></p>
  `;
}

function checkAnswer(selected, correct, btn) {
  const feedback = document.getElementById("feedback");
  const buttons = document.querySelectorAll("#options button");

  buttons.forEach(b => b.disabled = true);
  if (selected === correct) {
    btn.style.backgroundColor = "green";
    feedback.textContent = "✅ Correct!";
  } else {
    btn.style.backgroundColor = "red";
    feedback.textContent = `❌ Incorrect. Correct answer: ${correct}`;
  }
}

function toggleComparison() {
  const table = document.getElementById("comparisonTable");
  if (table.style.display === "none") {
    table.style.display = "block";
    table.innerHTML = `
      <table border="1" style="margin: auto; border-collapse: collapse;">
        <tr><th>Convention</th><th>Registers</th><th>Stack</th><th>Cleanup</th></tr>
        ${Object.values(conventions).map(c => `
          <tr>
            <td>${c.name}</td>
            <td>${c.registers.join(", ") || "None"}</td>
            <td>${c.stack.join(", ") || "None"}</td>
            <td>${c.cleanup}</td>
          </tr>`).join("")}
      </table>`;
  } else {
    table.style.display = "none";
  }
}
